import os
from PIL import Image

def repair_image(filename):
    base_dir = "c:/Users/rayak/OneDrive/Documents/sonam"
    path = os.path.join(base_dir, "public/images", filename)
    
    if not os.path.exists(path):
        print(f"Error: {path} not found")
        return
        
    img = Image.open(path)
    print(f"Opening {filename} (mode: {img.mode}, size: {img.size})")
    
    if img.mode == 'RGBA':
        # Split the channels
        r, g, b, a = img.split()
        # Merge only the RGB channels, completely ignoring the alpha channel
        # This prevents blending to black and preserves the raw drawing!
        rgb_img = Image.merge('RGB', (r, g, b))
        
        # Save it back as a fully opaque PNG
        rgb_img.save(path, 'PNG')
        print(f"Successfully repaired {filename} (alpha channel removed, RGB preserved)!")
    else:
        print(f"{filename} is already {img.mode} mode, no conversion needed.")

if __name__ == "__main__":
    repair_image("bg.png")
    repair_image("stickers.png")
