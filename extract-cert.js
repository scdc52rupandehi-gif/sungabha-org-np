const fs = require('fs');
let html = fs.readFileSync('D:/Sungabha/certificate Doner/code.html', 'utf8');

const match = html.match(/src="data:image\/(png|jpeg|jpg);base64,([^"]+)"/);
if (match) {
  const base64Data = match[2];
  fs.writeFileSync('public/images/cert-logo.png', Buffer.from(base64Data, 'base64'));
  html = html.replace(match[0], 'src="https://sungabha.org.np/images/cert-logo.png"');
  
  const templateString = 'export const getCertificateHtml = (name: string, date: string, amount: string, purpose: string) => `\n' + 
  html.replace(/`/g, '\\`').replace(/Gopal K\.C\./, '${name}').replace(/28-July-2026/, '${date}') + '\n`;\n';
  
  fs.writeFileSync('src/lib/certificateTemplate.ts', templateString);
  console.log('Processed successfully!');
} else {
  console.log('No base64 image found.');
}
