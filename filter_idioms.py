#!/usr/bin/env python3
"""
Filter idioms_with_3yo_explanations.csv to only include idioms found in idioms_1543.csv
"""

import csv

# Read the idioms from idioms_1543.csv to get the list of idioms we want to keep
idioms_to_keep = set()
with open('src/data/idioms_1543.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        idiom = row['idiom'].strip()
        idioms_to_keep.add(idiom)

print(f"Found {len(idioms_to_keep)} idioms in idioms_1543.csv")

# Read idioms_with_3yo_explanations.csv and filter
filtered_rows = []
header = None

with open('src/data/idioms_with_3yo_explanations.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)  # Save the header
    
    for row in reader:
        if len(row) >= 2:  # Make sure row has at least the idiom column
            idiom = row[1].strip()  # Second column is 成語
            if idiom in idioms_to_keep:
                filtered_rows.append(row)

print(f"Filtered to {len(filtered_rows)} idioms (from {6362 - 1} total)")

# Write the filtered results
with open('src/data/idioms_filtered.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(header)  # Write header
    writer.writerows(filtered_rows)

print("✓ Created src/data/idioms_filtered.csv")
