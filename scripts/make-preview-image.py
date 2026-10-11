# Builds app/opengraph-image.jpg (the WhatsApp/Facebook link preview) from the flyer and logo in design/.
# Run from the project folder:  python3 scripts/make-preview-image.py . app/opengraph-image.jpg
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
root = sys.argv[1]
W, H = 1200, 630
bg = Image.new("RGB", (W, H), (16, 13, 9))
# soft gold glow top-left
glow = Image.new("L", (W, H), 0); ImageDraw.Draw(glow).ellipse((-300, -350, 700, 500), fill=90)
glow = glow.filter(ImageFilter.GaussianBlur(120))
bg = Image.composite(Image.new("RGB", (W, H), (70, 48, 12)), bg, glow)

# Flyer on the right, full height, with a thin gold edge
fl = Image.open(f"{root}/design/promo-flyer-nana-abena-market.jpg").convert("RGB")
fh = H - 48; fw = round(fl.width * fh / fl.height)
fl = fl.resize((fw, fh), Image.LANCZOS)
fx = W - fw - 40; fy = 24
d = ImageDraw.Draw(bg)
d.rounded_rectangle((fx - 3, fy - 3, fx + fw + 2, fy + fh + 2), 14, fill=(216, 154, 24))
mask = Image.new("L", (fw, fh), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, fw - 1, fh - 1), 12, fill=255)
bg.paste(fl, (fx, fy), mask)

# Logo (crop the gold mark off its black background)
logo = Image.open(f"{root}/design/logo-original.jpeg").convert("RGB")
lum = logo.convert("L").point(lambda v: 255 if v > 40 else 0)
logo = logo.crop(lum.getbbox())
lw = 300; logo = logo.resize((lw, round(logo.height * lw / logo.width)), Image.LANCZOS)
lmask = logo.convert("L").point(lambda v: min(255, v * 3))
bg.paste(logo, (64, 52), lmask)

serif = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
serif_i = "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf"
sans_b = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
sans = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
y = 52 + logo.height + 34
d.text((64, y), "Satisfy your", font=ImageFont.truetype(serif, 64), fill=(255, 250, 243))
d.text((64, y + 64), "hunger.", font=ImageFont.truetype(serif_i, 64), fill=(244, 196, 87))
y += 160
for line in ["Jollof · Fried rice · Banku & tilapia", "Order on WhatsApp · Pickup & delivery"]:
    d.text((64, y), line, font=ImageFont.truetype(sans_b, 25), fill=(232, 222, 205)); y += 38
d.text((64, y + 6), "Opposite Nana Abena Market, Techiman", font=ImageFont.truetype(sans, 23), fill=(216, 154, 24))
bg.save(sys.argv[2], quality=86, optimize=True, progressive=True)
print(fx, fw, y)
