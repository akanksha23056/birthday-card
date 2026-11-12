import os
import sys
from PIL import Image, ImageChops, ImageFilter

def extract_stickers(image_path, output_dir, prefix, thresh=240, min_size=30):
    print(f"Processing {image_path}...")
    if not os.path.exists(image_path):
        print(f"Error: {image_path} not found")
        return
        
    os.makedirs(output_dir, exist_ok=True)
    
    # Load image and convert to RGBA
    img = Image.open(image_path).convert("RGBA")
    width, height = img.size
    
    # Create binary mask: 1 for sticker, 0 for white background
    # We downscale to 200x200 to find components quickly
    scale_factor = max(width, height) / 200.0
    if scale_factor < 1.0:
        scale_factor = 1.0
        
    down_w = int(width / scale_factor)
    down_h = int(height / scale_factor)
    
    img_down = img.resize((down_w, down_h), Image.Resampling.LANCZOS)
    
    mask = []
    for y in range(down_h):
        row = []
        for x in range(down_w):
            r, g, b, a = img_down.getpixel((x, y))
            # Background if alpha is low or if it's near-white
            is_bg = (a < 50) or (r >= thresh and g >= thresh and b >= thresh)
            if not is_bg:
                row.append(1)
            else:
                row.append(0)
        mask.append(row)
        
    # BFS to find connected components in the downscaled mask
    visited = [[False for _ in range(down_w)] for _ in range(down_h)]
    components = []
    
    for y in range(down_h):
        for x in range(down_w):
            if mask[y][x] == 1 and not visited[y][x]:
                # New component found, start BFS
                comp = []
                queue = [(x, y)]
                visited[y][x] = True
                
                while queue:
                    curr_x, curr_y = queue.pop(0)
                    comp.append((curr_x, curr_y))
                    
                    # 4-connectivity
                    for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        nx, ny = curr_x + dx, curr_y + dy
                        if 0 <= nx < down_w and 0 <= ny < down_h:
                            if mask[ny][nx] == 1 and not visited[ny][nx]:
                                visited[ny][nx] = True
                                queue.append((nx, ny))
                                
                components.append(comp)
                
    print(f"Found {len(components)} raw components in {image_path}")
    
    sticker_idx = 1
    for comp in components:
        # Get bounding box in downscaled coordinates
        xs = [pt[0] for pt in comp]
        ys = [pt[1] for pt in comp]
        min_x_d, max_x_d = min(xs), max(xs)
        min_y_d, max_y_d = min(ys), max(ys)
        
        # Filter out tiny components (noise)
        w_d = max_x_d - min_x_d + 1
        h_d = max_y_d - min_y_d + 1
        if w_d * scale_factor < min_size or h_d * scale_factor < min_size:
            continue
            
        # Map back to high-res coordinates (with a small margin)
        margin = 15
        min_x = max(0, int(min_x_d * scale_factor) - margin)
        min_y = max(0, int(min_y_d * scale_factor) - margin)
        max_x = min(width, int((max_x_d + 1) * scale_factor) + margin)
        max_y = min(height, int((max_y_d + 1) * scale_factor) + margin)
        
        # Crop the sticker from the high-res image
        crop_box = (min_x, min_y, max_x, max_y)
        sticker_crop = img.crop(crop_box)
        
        # Make the background of this crop transparent
        # We do this by setting alpha to 0 for white-ish pixels
        crop_w, crop_h = sticker_crop.size
        pixels = sticker_crop.load()
        
        # Also let's keep track of the tight bounding box of non-white pixels within this crop
        tight_min_x, tight_max_x = crop_w, 0
        tight_min_y, tight_max_y = crop_h, 0
        has_pixels = False
        
        for cy in range(crop_h):
            for cx in range(crop_w):
                r, g, b, a = pixels[cx, cy]
                
                # Make white or transparent pixels transparent
                is_bg = (a < 50) or (r >= thresh and g >= thresh and b >= thresh)
                if is_bg:
                    pixels[cx, cy] = (r, g, b, 0)
                else:
                    # It's a sticker pixel, update tight bounding box
                    tight_min_x = min(tight_min_x, cx)
                    tight_max_x = max(tight_max_x, cx)
                    tight_min_y = min(tight_min_y, cy)
                    tight_max_y = max(tight_max_y, cy)
                    has_pixels = True
                    
        if has_pixels:
            # Crop to tight bounding box to remove excess transparency on borders
            # Add a 2px padding
            padding = 2
            tight_min_x = max(0, tight_min_x - padding)
            tight_min_y = max(0, tight_min_y - padding)
            tight_max_x = min(crop_w, tight_max_x + padding)
            tight_max_y = min(crop_h, tight_max_y + padding)
            
            final_sticker = sticker_crop.crop((tight_min_x, tight_min_y, tight_max_x, tight_max_y))
            
            # Save the sticker
            out_name = f"{prefix}_{sticker_idx}.png"
            out_path = os.path.join(output_dir, out_name)
            final_sticker.save(out_path, "PNG")
            print(f"Saved sticker {sticker_idx} to {out_path} (size: {final_sticker.size})")
            sticker_idx += 1

if __name__ == "__main__":
    base_dir = "c:/Users/rayak/OneDrive/Documents/sonam"
    img_dir = os.path.join(base_dir, "public/images")
    out_dir = os.path.join(base_dir, "public/images/stickers")
    
    # 1. Process stickers.png
    extract_stickers(os.path.join(img_dir, "stickers.png"), out_dir, "stickers", thresh=242, min_size=20)
    
    # 2. Process cake.jpg
    extract_stickers(os.path.join(img_dir, "cake.jpg"), out_dir, "cake", thresh=240, min_size=30)
    
    # 3. Process lily.jpg
    extract_stickers(os.path.join(img_dir, "lily.jpg"), out_dir, "lily", thresh=240, min_size=30)

    # 4. Process new artistic painterly pastel sticker sheets
    extract_stickers(os.path.join(img_dir, "artistic_pastel_stickers_1.jpg"), out_dir, "pastel_1", thresh=242, min_size=50)
    extract_stickers(os.path.join(img_dir, "artistic_pastel_stickers_2.jpg"), out_dir, "pastel_2", thresh=242, min_size=50)
    
    print("Sticker extraction complete!")
