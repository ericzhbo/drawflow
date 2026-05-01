#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

def create_icon():
    img = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    margin = 80
    radius = 180
    draw.rounded_rectangle(
        [margin, margin, 1024-margin, 1024-margin],
        radius=radius,
        fill='#000000'
    )
    
    try:
        font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 500)
    except:
        font = ImageFont.load_default()
    
    text = 'D'
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = (1024 - text_w) // 2
    y = (1024 - text_h) // 2 - 40
    draw.text((x, y), text, fill='#FFFFFF', font=font)
    
    build_dir = '/Users/eric/学习/projects/jimeng/drawflow-v4/build'
    os.makedirs(build_dir, exist_ok=True)
    icon_png_path = os.path.join(build_dir, 'icon.png')
    img.save(icon_png_path)
    
    iconset_dir = os.path.join(build_dir, 'icon.iconset')
    os.makedirs(iconset_dir, exist_ok=True)
    
    sizes = [16, 32, 64, 128, 256, 512]
    for size in sizes:
        resized = img.resize((size, size), Image.LANCZOS)
        resized.save(f'{iconset_dir}/icon_{size}x{size}.png')
        if size <= 256:
            resized.save(f'{iconset_dir}/icon_{size//2}x{size//2}@2x.png')
    
    # 创建 256x256 的 PNG 作为 Windows 图标基础
    img_256 = img.resize((256, 256), Image.LANCZOS)
    img_256.save(os.path.join(build_dir, 'icon-256.png'))
    
    import subprocess
    import shutil
    result = subprocess.run(['iconutil', '-c', 'icns', iconset_dir, '-o', os.path.join(build_dir, 'icon.icns')], capture_output=True, text=True)
    if result.returncode == 0:
        print('✅ icns 图标已生成')
    else:
        print(f'❌ icns 生成失败: {result.stderr}')
    
    shutil.rmtree(iconset_dir)
    
    # 创建 Windows ICO（至少 256x256）
    ico_path = os.path.join(build_dir, 'icon.ico')
    img_256.save(ico_path, sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    print(f'✅ ICO 图标已生成: {ico_path}')
    
    # 创建托盘图标
    tray_img = Image.new('RGBA', (512, 512), (255, 255, 255, 0))
    tray_draw = ImageDraw.Draw(tray_img)
    tray_margin = 40
    tray_radius = 90
    tray_draw.rounded_rectangle(
        [tray_margin, tray_margin, 512-tray_margin, 512-tray_margin],
        radius=tray_radius,
        fill='#000000'
    )
    
    try:
        tray_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 250)
    except:
        tray_font = ImageFont.load_default()
    
    tray_bbox = tray_draw.textbbox((0, 0), 'D', font=tray_font)
    tray_text_w = tray_bbox[2] - tray_bbox[0]
    tray_text_h = tray_bbox[3] - tray_bbox[1]
    tray_x = (512 - tray_text_w) // 2
    tray_y = (512 - tray_text_h) // 2 - 20
    tray_draw.text((tray_x, tray_y), 'D', fill='#FFFFFF', font=tray_font)
    
    tray_icon_path = os.path.join(build_dir, 'icon-tray.png')
    tray_img.save(tray_icon_path)
    print(f'✅ 托盘图标已保存: {tray_icon_path}')
    
    print('✅ 所有图标生成完成')

create_icon()
