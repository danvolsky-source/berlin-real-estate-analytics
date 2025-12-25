#!/usr/bin/env python3
"""Remove white background from icon images using PIL."""

from PIL import Image
from pathlib import Path

def remove_white_background(input_path: str, output_path: str, threshold: int = 240):
    """Remove white/light background from image and save with transparency."""
    # Open image
    img = Image.open(input_path).convert("RGBA")
    
    # Get pixel data
    pixels = img.getdata()
    
    # Create new pixel data with transparency
    new_pixels = []
    for pixel in pixels:
        # If pixel is close to white (all RGB values above threshold), make it transparent
        if pixel[0] > threshold and pixel[1] > threshold and pixel[2] > threshold:
            new_pixels.append((255, 255, 255, 0))  # Transparent
        else:
            new_pixels.append(pixel)  # Keep original
    
    # Update image with new pixels
    img.putdata(new_pixels)
    
    # Save with transparency
    img.save(output_path, "PNG")
    print(f"✓ Processed: {output_path}")

def main():
    """Process all icon files."""
    base_path = Path("/home/ubuntu/berlin-real-estate-analytics/client/public")
    
    icons = [
        "mosque-icon.png",
        "church-icon.png",
        "synagogue-icon.png"
    ]
    
    for icon in icons:
        input_file = base_path / icon
        output_file = base_path / icon  # Overwrite original
        
        if input_file.exists():
            remove_white_background(str(input_file), str(output_file))
        else:
            print(f"✗ File not found: {input_file}")
    
    print("\n✓ All icons processed successfully!")

if __name__ == "__main__":
    main()
