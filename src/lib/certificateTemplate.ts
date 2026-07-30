export const getCertificateHtml = (name: string, date: string, amount: string, purpose: string) => `
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<title>Certificate of Appreciation — SCDC</title>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&amp;family=Great+Vibes&amp;family=Work+Sans:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<style>
  :root{
    --indigo:#1b3a6b;
    --indigo-deep:#122747;
    --forest:#1c7a4b;
    --forest-deep:#125333;
    --sun:#e8483c;
    --gold:#d99b1f;
    --gold-light:#f0c766;
    --cream:#f5efdf;
    --ink:#22303f;
    --muted:#5c6b78;
  }
  *{ box-sizing:border-box; }
  html,body{ margin:0; padding:0; background:#c7ccce; font-family:'Work Sans', sans-serif; color:var(--ink); }

  .stage{ min-height:100vh; display:flex; align-items:center; justify-content:center; padding:40px 16px; }

  .cert{
    position:relative;
    width:1000px; max-width:100%;
    aspect-ratio: 1000/700;
    background:var(--cream);
    overflow:hidden;
    box-shadow: 0 26px 50px -18px rgba(10,15,20,0.4);
    padding: 30px;
  }

  /* Ornate Border */
  .cert-border {
    position: absolute;
    inset: 20px;
    border: 2px solid var(--gold);
    pointer-events: none;
    z-index: 5;
  }
  .cert-border::before {
    content: "";
    position: absolute;
    inset: 6px;
    border: 1px solid var(--gold);
  }

  /* Corner Accents */
  .corner {
    position: absolute;
    width: 60px;
    height: 60px;
    color: var(--gold);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 6;
    background: var(--cream);
  }
  .corner span { font-size: 40px; }
  .top-left { top: -2px; left: -2px; }
  .top-right { top: -2px; right: -2px; transform: rotate(90deg); }
  .bottom-left { bottom: -2px; left: -2px; transform: rotate(-90deg); }
  .bottom-right { bottom: -2px; right: -2px; transform: rotate(180deg); }

  /* subtle mandala watermark */
  .watermark{ position:absolute; inset:0; opacity:0.07; z-index: 1; }

  .content{
    position:relative;
    z-index: 2;
    height:100%;
    display:flex; flex-direction:column; align-items:center; text-align:center;
    padding: 40px 60px;
  }

  /* Bigger Logo & Branding */
  .header-brand{
    display:flex; flex-direction: column; align-items:center; gap:16px;
    margin-bottom:24px;
  }
  .header-brand .emblem{
    width:90px; height:90px; border-radius:50%; overflow:hidden;
    box-shadow: 0 0 0 3px var(--cream), 0 0 0 5px var(--gold);
  }
  .header-brand .emblem img{ width:100%; height:100%; object-fit:cover; display:block; }
  .header-brand .org-text{ text-align:center; }
  .header-brand .org-name{ 
    font-family: 'Playfair Display', serif;
    font-size:28px; 
    font-weight:800; 
    color:var(--indigo-deep); 
    letter-spacing:0.5px;
    text-transform: uppercase;
  }
  .header-brand .org-sub{ 
    font-size:12px; 
    color:var(--muted); 
    letter-spacing:1.5px; 
    margin-top:6px;
    font-weight: 500;
  }

  .title{
    font-family:'Playfair Display', serif; font-weight:800; font-size:38px;
    color:var(--gold); letter-spacing:1px;
    margin-bottom: 10px;
    text-transform: capitalize;
  }

  .ribbon{
    position:relative;
    margin-top:10px;
    padding:10px 50px;
    background:var(--indigo);
    color:#fff;
    font-size:14px;
    letter-spacing:0.8px;
    font-weight:500;
  }
  .ribbon::before, .ribbon::after{
    content:"";
    position:absolute; top:0;
    width:0; height:0;
    border-top:20px solid var(--indigo);
  }
  .ribbon::before{ left:-18px; border-left:18px solid transparent; }
  .ribbon::after{ right:-18px; border-right:18px solid transparent; }
  .ribbon-tailL, .ribbon-tailR{
    position:absolute; bottom:-10px; width:0; height:0;
    border-top:10px solid var(--indigo-deep);
  }
  .ribbon-tailL{ left:-18px; border-left:18px solid transparent; }
  .ribbon-tailR{ right:-18px; border-right:18px solid transparent; }

  .donor-name{
    font-family:'Great Vibes', cursive;
    font-size:64px;
    color:var(--indigo-deep);
    margin: 20px 0 0px;
  }
  .name-rule{ width:400px; height:1.5px; background:linear-gradient(to right, transparent, var(--gold), transparent); margin-bottom:24px; }

  .body-text{ font-size:16px; line-height:1.7; color:#3c4a57; max-width:640px; }
  .body-text b{ color:var(--forest-deep); font-weight:600; }

  .date-line{ margin-top:24px; font-size:14px; color:var(--muted); font-style: italic; }

  .sign-row{
    position:relative;
    margin-top:auto;
    width:100%;
    display:flex; justify-content:center;
    padding-top:20px;
  }
  .sign-block{ text-align:center; }
  .sign-block .line{ width:280px; border-top:1px solid var(--gold); margin-bottom:10px; }
  .sign-block .name{ font-size:15px; font-weight:600; color:var(--indigo-deep); }
  .sign-block .role{ font-size:12px; color:var(--muted); margin-top:2px; }

  .footer-note{
    margin-top:12px;
    font-size:10px;
    letter-spacing:2px;
    text-transform:uppercase;
    color:#8a9099;
  }
</style>
</head>
<body>
<div class="stage">
<div class="cert">
<!-- Ornate Border and Corners -->
<div class="cert-border">
<div class="corner top-left"><span class="material-symbols-outlined">filter_vintage</span></div>
<div class="corner top-right"><span class="material-symbols-outlined">filter_vintage</span></div>
<div class="corner bottom-left"><span class="material-symbols-outlined">filter_vintage</span></div>
<div class="corner bottom-right"><span class="material-symbols-outlined">filter_vintage</span></div>
</div>
<!-- Background Watermark -->
<svg class="watermark" viewbox="0 0 1000 700" xmlns="http://www.w3.org/2000/svg">
<defs>
<pattern height="130" id="mandalaWM" patternunits="userSpaceOnUse" width="130">
<g fill="none" stroke="var(--indigo)" stroke-width="1.4" transform="translate(65,65)">
<circle r="46"></circle>
<circle r="30"></circle>
<circle r="14"></circle>
<g stroke-width="1.1">
<line x1="-46" x2="46" y1="0" y2="0"></line>
<line x1="0" x2="0" y1="-46" y2="46"></line>
<line x1="-33" x2="33" y1="-33" y2="33"></line>
<line x1="-33" x2="33" y1="33" y2="-33"></line>
</g>
</g>
</pattern>
</defs>
<rect fill="url(#mandalaWM)" height="700" width="1000"></rect>
</svg>
<div class="content">
<div class="header-brand">
<div class="emblem"><img alt="SCDC Logo" src="https://sungabha.org.np/images/cert-logo.png"/></div>
<div class="org-text">
<div class="org-name">Sungabha Community Development Centre</div>
<div class="org-sub">Rudrapur, Rupandehi · Estd. 2052</div>
</div>
</div>
<div class="title">Certificate of Appreciation</div>
<div class="ribbon">
<span class="ribbon-tailL"></span>
        This certificate is presented to
        <span class="ribbon-tailR"></span>
</div>
<div class="donor-name">${name}</div>
<div class="name-rule"></div>
<div class="body-text">
        In sincere recognition of your generous contribution of <b></b> towards <b></b>,
        helping Sungabha Community Development Centre empower marginalized communities in
        Rudrapur, Rupandehi and build a brighter future.
      </div>
<div class="date-line">Given this 30th day of July, 2026</div>
<div class="sign-row">
<div class="sign-block">
<div class="line"></div>
<div class="name">SCDC Executive Committee</div>
<div class="role">Sungabha Community Development Centre</div>
</div>
</div>
<div class="footer-note">Official Document of SCDC</div>
</div>
</div>
</div>
</body></html>
`;
