const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const quotes = [
  [
    "The only way to do great work is to love what you do.",
    "— Steve Jobs",
    "",
    "Success is not final, failure is not fatal:",
    "it is the courage to continue that counts.",
    "— Winston Churchill",
    "",
    "Believe you can and you're halfway there.",
    "— Theodore Roosevelt",
    "",
    "The future belongs to those who believe",
    "in the beauty of their dreams.",
    "— Eleanor Roosevelt",
    "",
    "Don't watch the clock; do what it does.",
    "Keep going.",
    "— Sam Levenson"
  ],
  [
    "It does not matter how slowly you go",
    "as long as you do not stop.",
    "— Confucius",
    "",
    "Everything you've ever wanted is on the",
    "other side of fear.",
    "— George Addair",
    "",
    "The only impossible journey is the one",
    "you never begin.",
    "— Tony Robbins",
    "",
    "Your limitation—it's only your imagination.",
    "",
    "Push yourself, because no one else is going",
    "to do it for you.",
    "",
    "Great things never come from comfort zones."
  ],
  [
    "The best time to plant a tree was 20 years ago.",
    "The second best time is now.",
    "— Chinese Proverb",
    "",
    "Your time is limited, don't waste it living",
    "someone else's life.",
    "— Steve Jobs",
    "",
    "The mind is everything. What you think",
    "you become.",
    "— Buddha",
    "",
    "Happiness is not something ready made.",
    "It comes from your own actions.",
    "— Dalai Lama",
    "",
    "Start where you are. Use what you have.",
    "Do what you can.",
    "— Arthur Ashe"
  ],
  [
    "You are never too old to set another goal",
    "or to dream a new dream.",
    "— C.S. Lewis",
    "",
    "The secret of getting ahead is getting started.",
    "— Mark Twain",
    "",
    "Don't be afraid to give up the good",
    "to go for the great.",
    "— John D. Rockefeller",
    "",
    "I find that the harder I work, the more",
    "luck I seem to have.",
    "— Thomas Jefferson",
    "",
    "Success usually comes to those who are",
    "too busy to be looking for it.",
    "— Henry David Thoreau"
  ],
  [
    "Don't be distracted by criticism.",
    "Remember, the only taste of success",
    "in life is to be able to say 'I tried'.",
    "— Unknown",
    "",
    "The way to get started is to quit talking",
    "and begin doing.",
    "— Walt Disney",
    "",
    "If you really want to do something,",
    "you'll find a way. If not,",
    "you'll find an excuse.",
    "— Jim Rohn",
    "",
    "You don't have to be great to start,",
    "but you have to start to be great.",
    "— Zig Ziglar",
    "",
    "A dream doesn't become reality",
    "through magic; it takes determination",
    "and hard work."
  ],
  [
    "Quality is not an act, it is a habit.",
    "— Aristotle",
    "",
    "The only person you are destined to become",
    "is the person you decide to be.",
    "— Ralph Waldo Emerson",
    "",
    "Believe in yourself and all that you are.",
    "Know that there is something inside you",
    "that is greater than any obstacle.",
    "",
    "What you get by achieving your goals",
    "is not as important as what you become",
    "by achieving your goals.",
    "— Zig Ziglar",
    "",
    "Success is the sum of small efforts,",
    "repeated day in and day out."
  ],
  [
    "The only limit to our realization of tomorrow",
    "will be our doubts of today.",
    "— Franklin D. Roosevelt",
    "",
    "It always seems impossible until it's done.",
    "— Nelson Mandela",
    "",
    "Don't stop when you're tired.",
    "Stop when you're done.",
    "",
    "Wake up with determination.",
    "Go to bed with satisfaction.",
    "",
    "Little minds are tame and conformed,",
    "but great minds think and lead.",
    "— Aristotle",
    "",
    "Dream big and dare to fail.",
    "— Norman Vaughan"
  ]
];

const doc = new PDFDocument({ size: 'A4', margin: 50 });
const outputPath = path.join(__dirname, '..', 'public', 'quotes.pdf');

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

const writePage = (pageQuotes, isFirstPage = false) => {
  if (!isFirstPage) doc.addPage();

  doc.fontSize(28)
    .font('Helvetica-Bold')
    .fillColor('#1E3A8A')
    .text('Motivational Quotes', { align: 'center' });

  doc.moveDown(2);

  doc.fontSize(14)
    .font('Helvetica')
    .fillColor('#333');

  pageQuotes.forEach(quote => {
    if (quote.includes('—')) {
      doc.fillColor('#666').text(quote, { align: 'center' });
    } else if (quote === '') {
      doc.moveDown(0.5);
    } else {
      doc.fillColor('#333').text(quote, { align: 'center' });
    }
    doc.moveDown(0.3);
  });
};

writePage(quotes[0], true);

for (let i = 1; i < quotes.length; i++) {
  writePage(quotes[i]);
}

doc.end();
stream.on('finish', () => {
  console.log('PDF created:', outputPath);
});