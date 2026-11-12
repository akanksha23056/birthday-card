// content.js
// =========================================================================
// EDIT THIS FILE TO CHANGE ALL THE PHOTOS AND MESSAGES ON THE WEBSITE!
// =========================================================================

export const heroContent = {
  // Phrases shown on the sticky notes in the Hero section (Act 1)
  stickyNotes: [
    { text: "my favorite person!", rotation: -6, color: "bg-yellow-100/90" },
    { text: "21 & iconic ✨", rotation: 8, color: "bg-pink-100/90" },
    { text: "always and forever ❤️", rotation: -4, color: "bg-purple-100/90" }
  ],
  // Washi tape strips in the Hero section
  washiTapes: [
    { rotation: 12, color: "bg-pink-300/40" },
    { rotation: -15, color: "bg-yellow-300/40" }
  ]
};

export const diaryPages = [
  {
    pageNumber: 1,
    // Swap this with your actual image path, e.g. "/images/beach_trip.jpg"
    image: "/images/photo-1.jpg", 
    imageAlt: "A lovely memory of us",
    caption: "where it all began... 📍",
    message: "Remember when we first met? I was so nervous, but the moment you laughed, all my fears melted away. This page is dedicated to that very first spark that started it all.",
    bgColor: "bg-[#FFFDF4]" // Warm ivory
  },
  {
    pageNumber: 2,
    image: "/images/photo-2.jpg",
    imageAlt: "Cute coffee date photo",
    caption: "coffee dates & gossip ☕",
    message: "Our endless conversations over lukewarm coffee. We could talk about absolutely nothing for hours and still feel like we ran out of time. You make the mundane feel magical.",
    bgColor: "bg-[#FAFAFA]" // Soft white
  },
  {
    pageNumber: 3,
    image: "/images/photo-3.jpg",
    imageAlt: "Late night adventures",
    caption: "midnight drives 🚗🌙",
    message: "Those late-night drives when we had nowhere to go, blasting our favorite playlist, singing at the top of our lungs. The city lights had nothing on the brightness of your smile.",
    bgColor: "bg-[#FDF6F0]" // Creamy peach
  },
  {
    pageNumber: 4,
    image: "/images/photo-4.jpg",
    imageAlt: "Sonam smiling",
    caption: "pure happiness! 😊⭐",
    message: "I love this photo of you because it captures your essence so perfectly. Your laugh is my favorite sound in the world, and I promise to keep doing silly things just to hear it.",
    bgColor: "bg-[#FAF7F0]" // Warm stone
  },
  {
    pageNumber: 5,
    image: "/images/photo-5.jpg",
    imageAlt: "Our favorite trip together",
    caption: "lost in paradise ✈️🌴",
    message: "That weekend getaway when we got completely lost, ended up in the wrong town, and had the absolute best day of our lives anyway. With you, every detour is a beautiful adventure.",
    bgColor: "bg-[#FFFBF0]" // Pale vanilla
  },
  {
    pageNumber: 6,
    image: "/images/photo-6.jpg",
    imageAlt: "A cozy rainy day",
    caption: "cozy rainy afternoons 🌧️❤️",
    message: "Sharing an umbrella, getting our shoes soaked, and coming back to share hot chocolate under a mountain of blankets. There is no storm we can't weather together.",
    bgColor: "bg-[#F7F6FB]" // Ice lavender
  }
];

// =========================================================================
// GRAND FINALE: PAGES 7 & 8
// These pages start blank and type out your final heartfelt message.
// =========================================================================
export const finalSpread = {
  // Put your long, customized message here. HTML line breaks (<br/>) are supported!
  message: `Dearest Sonam,<br/><br/>

On this very special day, I wanted to create something as unique and beautiful as you are. A little digital scrapbook to remind you of all the chapters we've written together, and the endless blank pages waiting for us.<br/><br/>

You are my anchor, my favorite adventure, and my home. Watching you grow, laugh, and succeed is the greatest privilege of my life. You deserve all the stars in the night sky and all the joy this world can offer.<br/><br/>

Thank you for being you, for your beautiful heart, and for making my world so much brighter.<br/><br/>

Happy 21st Birthday, my love. Here's to forever.<br/><br/><div style="margin: 20px auto; max-width: 260px; background: #fff; padding: 12px 12px 24px 12px; border-radius: 4px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); transform: rotate(-2deg); border: 1px solid #f0e6d2;"><img src="/images/photo-7.jpg" alt="Special memory" style="width: 100%; height: auto; border-radius: 2px; display: block;" /><p style="margin: 10px 0 0 0; text-align: center; font-family: cursive, sans-serif; font-size: 14px; color: #555;">forever with you ✨</p></div><br/>

Always yours,<br/>
[Your Name]`,
  
  signature: "the end. i love you. ❤️",
  
  // Enable typing clicking sound effects
  audioEnabledByDefault: true
};
