import fs from 'fs';
import path from 'path';
import resources from '@/constants/resource-library.json';
import { websiteUrl } from '@/lib/websiteUrl';

describe('competitor website links', () => {
  it('gives nothing for an empty address', () => {
    expect(websiteUrl('')).toBeNull();
    expect(websiteUrl('   ')).toBeNull();
    expect(websiteUrl(undefined)).toBeNull();
  });

  it('adds https:// to a bare domain', () => {
    expect(websiteUrl('example.com')).toBe('https://example.com/');
    expect(websiteUrl(' www.acme.co.uk/shop ')).toBe(
      'https://www.acme.co.uk/shop');
  });

  it('keeps http and https addresses', () => {
    expect(websiteUrl('http://a.example')).toBe('http://a.example/');
    expect(websiteUrl('https://a.example/x')).toBe('https://a.example/x');
  });

  it('refuses other schemes', () => {
    expect(websiteUrl('javascript:alert(1)')).toBeNull();
    expect(websiteUrl('data:text/html,hi')).toBeNull();
  });
});

describe('downloadable resources', () => {
  it.each(resources.resources.map((r) => [r.id, r.downloadUrl]))(
    '%s points at a file that exists', (_id, url) => {
      const file = path.join(process.cwd(), 'public', String(url));
      expect(fs.existsSync(file)).toBe(true);
      expect(fs.statSync(file).size).toBeGreaterThan(1000);
    },
  );
});
