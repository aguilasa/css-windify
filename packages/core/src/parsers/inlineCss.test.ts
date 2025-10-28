import { describe, it, expect } from 'vitest';
import { parseInlineCss } from './inlineCss';

describe('inlineCss parser', () => {
  it('should parse valid inline CSS', () => {
    const style = 'color: red; margin: 10px; padding: 5px;';
    const result = parseInlineCss(style);
    
    expect(result).toEqual([
      { prop: 'color', value: 'red' },
      { prop: 'margin', value: '10px' },
      { prop: 'padding', value: '5px' }
    ]);
  });

  it('should handle whitespace correctly', () => {
    const style = '  color : red ;  margin:10px  ;  padding : 5px  ;  ';
    const result = parseInlineCss(style);
    
    expect(result).toEqual([
      { prop: 'color', value: 'red' },
      { prop: 'margin', value: '10px' },
      { prop: 'padding', value: '5px' }
    ]);
  });

  it('should ignore empty declarations', () => {
    const style = 'color: red;; margin: ; : 10px; padding: 5px;';
    const result = parseInlineCss(style);
    
    expect(result).toEqual([
      { prop: 'color', value: 'red' },
      { prop: 'padding', value: '5px' }
    ]);
  });

  it('should handle complex values', () => {
    const style = 'background: url("image.jpg"); font-family: "Arial", sans-serif; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
    const result = parseInlineCss(style);
    
    expect(result).toEqual([
      { prop: 'background', value: 'url("image.jpg")' },
      { prop: 'font-family', value: '"Arial", sans-serif' },
      { prop: 'box-shadow', value: '0 2px 4px rgba(0,0,0,0.1)' }
    ]);
  });

  it('should handle empty input', () => {
    expect(parseInlineCss('')).toEqual([]);
    expect(parseInlineCss('   ')).toEqual([]);
    expect(parseInlineCss(null as unknown as string)).toEqual([]);
  });

  it('should preserve declaration order', () => {
    const style = 'padding: 5px; margin: 10px; color: red;';
    const result = parseInlineCss(style);
    
    expect(result[0].prop).toBe('padding');
    expect(result[1].prop).toBe('margin');
    expect(result[2].prop).toBe('color');
  });
});
