import { describe, it, expect } from 'vitest';
import { buildSearchParts } from './buildSearchParts';
import { SearchFormData } from './searchSchema';

describe('buildSearchParts', () => {
  it('キーワードのみの場合、キーワードのみ返す', () => {
    const data: SearchFormData = {
      keyword: 'react',
      star: { min: '', max: '' },
      fork: { min: '', max: '' },
      size: { min: '', max: '' },
      duration: { created: '', pushed: '' },
    };

    expect(buildSearchParts(data)).toBe('react');
  });

  describe('star', () => {
    it('min と max が両方ある場合、.. で繋げる', () => {
      const data: SearchFormData = {
        keyword: 'react',
        star: { min: '100', max: '1000' },
        fork: { min: '', max: '' },
        size: { min: '', max: '' },
        duration: { created: '', pushed: '' },
      };

      expect(buildSearchParts(data)).toBe('react stars:100..1000');
    });

    it('min のみの場合、>= を使用', () => {
      const data: SearchFormData = {
        keyword: 'react',
        star: { min: '100', max: '' },
        fork: { min: '', max: '' },
        size: { min: '', max: '' },
        duration: { created: '', pushed: '' },
      };

      expect(buildSearchParts(data)).toBe('react stars:>=100');
    });

    it('max のみの場合、<= を使用', () => {
      const data: SearchFormData = {
        keyword: 'react',
        star: { min: '', max: '1000' },
        fork: { min: '', max: '' },
        size: { min: '', max: '' },
        duration: { created: '', pushed: '' },
      };

      expect(buildSearchParts(data)).toBe('react stars:<=1000');
    });
  });

  describe('fork', () => {
    it('min と max が両方ある場合、.. で繋げる', () => {
      const data: SearchFormData = {
        keyword: 'react',
        star: { min: '', max: '' },
        fork: { min: '10', max: '100' },
        size: { min: '', max: '' },
        duration: { created: '', pushed: '' },
      };

      expect(buildSearchParts(data)).toBe('react forks:10..100');
    });

    it('min のみの場合、>= を使用', () => {
      const data: SearchFormData = {
        keyword: 'react',
        star: { min: '', max: '' },
        fork: { min: '10', max: '' },
        size: { min: '', max: '' },
        duration: { created: '', pushed: '' },
      };

      expect(buildSearchParts(data)).toBe('react forks:>=10');
    });
  });

  describe('size', () => {
    it('min と max が両方ある場合、.. で繋げる', () => {
      const data: SearchFormData = {
        keyword: 'react',
        star: { min: '', max: '' },
        fork: { min: '', max: '' },
        size: { min: '100', max: '500' },
        duration: { created: '', pushed: '' },
      };

      expect(buildSearchParts(data)).toBe('react size:100..500');
    });

    it('max のみの場合、<= を使用', () => {
      const data: SearchFormData = {
        keyword: 'react',
        star: { min: '', max: '' },
        fork: { min: '', max: '' },
        size: { min: '', max: '500' },
        duration: { created: '', pushed: '' },
      };

      expect(buildSearchParts(data)).toBe('react size:<=500');
    });
  });

  describe('duration', () => {
    it('created のみの場合、created:>= を使用', () => {
      const data: SearchFormData = {
        keyword: 'react',
        star: { min: '', max: '' },
        fork: { min: '', max: '' },
        size: { min: '', max: '' },
        duration: { created: '2024-01-01', pushed: '' },
      };

      expect(buildSearchParts(data)).toBe('react created:>=2024-01-01');
    });

    it('pushed のみの場合、pushed:<= を使用', () => {
      const data: SearchFormData = {
        keyword: 'react',
        star: { min: '', max: '' },
        fork: { min: '', max: '' },
        size: { min: '', max: '' },
        duration: { created: '', pushed: '2024-12-31' },
      };

      expect(buildSearchParts(data)).toBe('react pushed:<=2024-12-31');
    });

    it('created と pushed が両方ある場合、両方追加', () => {
      const data: SearchFormData = {
        keyword: 'react',
        star: { min: '', max: '' },
        fork: { min: '', max: '' },
        size: { min: '', max: '' },
        duration: { created: '2024-01-01', pushed: '2024-12-31' },
      };

      expect(buildSearchParts(data)).toBe('react created:>=2024-01-01 pushed:<=2024-12-31');
    });
  });

  describe('複数条件の組み合わせ', () => {
    it('すべての条件が組み合わさる場合、スペースで結合', () => {
      const data: SearchFormData = {
        keyword: 'react',
        star: { min: '100', max: '1000' },
        fork: { min: '10', max: '' },
        size: { min: '', max: '500' },
        duration: { created: '2024-01-01', pushed: '' },
      };

      expect(buildSearchParts(data)).toBe(
        'react stars:100..1000 forks:>=10 size:<=500 created:>=2024-01-01'
      );
    });

    it('一部の条件のみの場合、該当する条件のみ追加', () => {
      const data: SearchFormData = {
        keyword: 'vue',
        star: { min: '50', max: '' },
        fork: { min: '', max: '' },
        size: { min: '', max: '' },
        duration: { created: '', pushed: '2024-12-31' },
      };

      expect(buildSearchParts(data)).toBe('vue stars:>=50 pushed:<=2024-12-31');
    });
  });
});
