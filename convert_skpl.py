import fitz
import os
import argparse

def convert(start_index, end_index, mode):
    pdf_path = "docs/SKPL_ArtConnect.pdf"
    output_md = "docs/SKPL.md"

    doc = fitz.open(pdf_path)
    # Increase cutoff slightly if needed, but the main issue is text detection
    HEADER_Y_CUTOFF = 100

    # Ensure we don't go out of bounds
    if end_index > len(doc):
        end_index = len(doc)

    print(f"Processing pages {start_index + 1} to {end_index}")

    with open(output_md, mode) as f:
        for i in range(start_index, end_index):
            page = doc[i]
            page_num = i + 1

            blocks = page.get_text("dict")["blocks"]
            blocks.sort(key=lambda b: (b["bbox"][1], b["bbox"][0]))

            for block in blocks:
                bbox = block["bbox"]

                # Header Filtering Logic
                if bbox[1] < HEADER_Y_CUTOFF:
                    if block["type"] == 0:
                        # Reconstruct text line by line to check content
                        text_content = ""
                        for line in block["lines"]:
                            for span in line["spans"]:
                                text_content += span["text"] + " "

                        text_content = text_content.strip()

                        # Debug print (commented out)
                        # print(f"Page {page_num} Top Block: '{text_content}' at Y={bbox[1]}")

                        # Strict checks for known header patterns
                        # "ArtConnect Panduan GL01A Halaman X dari Y"

                        is_header = False
                        if "ArtConnect" in text_content and "Panduan GL01A" in text_content:
                            is_header = True
                        if "Halaman" in text_content and "dari" in text_content:
                            is_header = True

                        if is_header:
                            continue

                if block["type"] == 0: # Text
                    block_text = ""
                    for line in block["lines"]:
                        line_text = ""
                        for span in line["spans"]:
                            line_text += span["text"]
                        block_text += line_text + " "

                    block_text = block_text.strip()
                    if block_text:
                        f.write(block_text + "\n\n")

                elif block["type"] == 1: # Image
                    f.write(f"> *[Gambar terdapat pada halaman {page_num} di dokumen asli]*\n\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--start", type=int, required=True)
    parser.add_argument("--end", type=int, required=True)
    parser.add_argument("--mode", type=str, required=True)
    args = parser.parse_args()

    convert(args.start, args.end, args.mode)
