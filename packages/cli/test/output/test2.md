# CSSWindify Conversion Report

## Input

Files: fixtures/button.css
Mode: Approximate
Thresholds: spacing=2px, font=1px, radii=2px

## Results by Selector

### .btn

Classes: inline-block m-[0.25rem] px-[1rem] py-[0.5rem] font-semibold leading-[1.5] text-[#ffffff] text-[1rem] text-center bg-[#3b82f6] border border-transparent rounded
Warnings:

- Used arbitrary value for 'padding: 0.5rem 1rem'
- Used arbitrary value for 'margin: 0.25rem'
- Used arbitrary value for 'font-size: 1rem'
  ... and 4 more
  Coverage: 100% (11/11)

### .btn:hover

Classes: hover:bg-[#2563eb]
Warnings:

- Used arbitrary value for 'background-color: #2563eb'
- Selector '.btn:hover' was converted but may need manual adjustment
  Coverage: 100% (1/1)

## Summary

# Tailwind CSS Transformation Summary

## Overall Coverage: 100% (12/12)

- Non-arbitrary classes: 6
- Total classes generated: 14
- Total warnings: 9

## Coverage by Category

- spacing: 100% (2/2)
- color: 100% (3/3)
- typography: 100% (4/4)
- layout: 100% (1/1)
- border: 100% (2/2)

## Warnings by Category

- arbitrary-value: 7

## Sample Classes

inline-block m-[0.25rem] px-[1rem] py-[0.5rem] font-semibold leading-[1.5] text-[#ffffff] text-[1rem] text-center bg-[#3b82f6] ...

## Sample Warnings

- Used arbitrary value for 'padding: 0.5rem 1rem'
- Used arbitrary value for 'margin: 0.25rem'
- Used arbitrary value for 'font-size: 1rem'
- Used arbitrary value for 'line-height: 1.5'
- Used arbitrary value for 'background-color: #3b82f6'
- ... and 4 more
