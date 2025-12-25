#!/usr/bin/env python3
"""Remove white background from icon images and make them transparent."""

import cv2
import numpy as np
from pathlib import Path

def remove_white_background(input_path: str, output_path: str):
    """Remove white background from image and save with transparency."""
    # Read image
    img = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)
    
    # Convert to RGBA if needed
    if img.shape[2] == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR to BGRA)
    
    # Create mask for white pixels (with some tolerance)
    # White is (255, 255, 255) in BGR
    lower_white = np.array([240, 240, 240, 0])
    upper_white = np.array([255, 255, 255, 255])
    
    # Create mask
    mask = cv2.inRange(img, lower_white, upper_white)
    
    # Invert mask (we want to keep non-white pixels)
    mask_inv = cv2.bitwise_not(mask)
    
    # Set alpha channel based on mask
    img[:, :, 3] = mask_inv
    
    # Save with transparency
    cv2.imwrite(output_path, img)
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
