/**
 * Dataset Generator for Billboard Analysis Evaluation
 *
 * Generates diverse test scenarios as text descriptions of billboards.
 * Each scenario includes expected outputs for validation.
 *
 * Usage: npm run eval:generate
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { TestCase, Dataset } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate the test dataset
 */
function generateDataset(): Dataset {
  const testCases: TestCase[] = [
    // 1. Arabic-compliant (high scoring)
    {
      id: 'arabic_compliant_high',
      name: 'Arabic-Primary Compliant Billboard',
      category: 'compliant',
      description: `A professional telecommunications billboard. Large Arabic headline 'عروض رمضان الحصرية' (Exclusive Ramadan Offers) at 18 inches height in bold white (#FFFFFF) text, prominently positioned in the top half of the billboard. Below it, smaller English text 'Exclusive Ramadan Offers' at 7 inches. Deep navy blue background (#1E3A5F). Single smartphone image on the right showing the app interface. Price displayed as '٤٩ ر.ع.' (49 OMR) in Arabic numerals. Brand logo 'Ooredoo' in bottom right corner at 4 inches. Clean layout with ample white space. High contrast ratio approximately 14:1. Arabic text is clearly dominant, occupying 60% of text area. Total word count: 6 words. QR code in bottom left corner.`,
      expected: {
        score_range: [7.5, 10.0],
        arabic_detected: true,
        arabic_is_primary: true,
        compliance_status: 'compliant',
        critical_issues_keywords: [],
        has_cta: true,
      },
    },

    // 2. English-only violation
    {
      id: 'english_only_violation',
      name: 'English-Only Critical Violation',
      category: 'violation',
      description: `Billboard for a fitness center with English-only text. Headline 'GET FIT THIS SUMMER' in bold red (#E53935) text at 12 inches on white (#FFFFFF) background. Subheadline '50% OFF MEMBERSHIP' at 6 inches. Image of muscular person exercising. Phone number '9876 5432' and website 'www.fitzone.com' at bottom. Modern geometric design elements. Good contrast ratio 8:1. Clean layout. NO ARABIC TEXT ANYWHERE on the billboard - only English. Total 8 words.`,
      expected: {
        score_range: [0, 4.5],
        arabic_detected: false,
        arabic_is_primary: false,
        compliance_status: 'critical_violation_no_arabic',
        critical_issues_keywords: ['arabic', 'ordinance', 'legal', 'violation'],
        has_cta: true,
      },
    },

    // 3. Cluttered design
    {
      id: 'cluttered_design',
      name: 'Cluttered Busy Billboard',
      category: 'readability',
      description: `Extremely cluttered retail sale billboard. Arabic headline 'تخفيضات ضخمة' at 8 inches, English 'MEGA SALE' at 7 inches - similar sizes. But the billboard is overwhelmed with content: '70% OFF', 'BUY 2 GET 1 FREE', 'LIMITED TIME ONLY', 'WHILE STOCKS LAST', store hours '9AM-11PM', address 'Al Khuwair Street', phone number, WhatsApp number, Instagram handle '@megastore', Facebook page, website URL, and 6 different product images arranged in a collage. Background has gradient from pink to purple with yellow starburst shapes. Text in white, yellow, red, and black scattered across the billboard. Multiple fonts used. Total word count: 28 words. Contrast varies from 2:1 to 15:1 across different elements. Arabic text present but not dominant.`,
      expected: {
        score_range: [2.5, 5.5],
        arabic_detected: true,
        arabic_is_primary: false,
        compliance_status: 'partial',
        critical_issues_keywords: ['word count', 'clutter', 'readability'],
        has_cta: true,
      },
    },

    // 4. Clean design high scoring
    {
      id: 'clean_design_exemplar',
      name: 'Clean Minimalist Design (Exemplar)',
      category: 'exemplar',
      description: `Premium automotive billboard with exceptional design. Large Arabic headline 'القيادة المستقبلية' (The Future of Driving) at 20 inches in elegant white (#FFFFFF) serif font centered at top. English tagline 'The Future of Driving' at 6 inches directly below. Solid deep black (#000000) background providing maximum contrast. Single hero image of sleek electric car in silver, positioned in lower half. Brand logo 'BMW' at 5 inches in bottom right. Contrast ratio 21:1. Arabic clearly dominant at 3x English size. Total 5 words. Perfect visual hierarchy. Ample negative space. No clutter. Professional, premium feel.`,
      expected: {
        score_range: [8.5, 10.0],
        arabic_detected: true,
        arabic_is_primary: true,
        compliance_status: 'compliant',
        critical_issues_keywords: [],
        has_cta: false,
      },
    },

    // 5. Poor contrast
    {
      id: 'poor_contrast',
      name: 'Poor Contrast Billboard',
      category: 'contrast',
      description: `Travel agency billboard with contrast issues. Arabic headline 'سافر معنا' (Travel With Us) at 14 inches and English 'TRAVEL WITH US' at 8 inches. Arabic is larger and primary. However, the color scheme is problematic: light gray text (#C0C0C0) on white background (#F5F5F5). Extremely poor contrast ratio estimated at 1.5:1. Beach sunset image in background with palm trees, which further reduces text visibility as colors blend together. Flight and hotel icons in light blue. Website URL barely visible. Total 5 words. Text is essentially unreadable, especially from distance.`,
      expected: {
        score_range: [2.5, 5.5],
        arabic_detected: true,
        arabic_is_primary: true,
        compliance_status: 'compliant',
        critical_issues_keywords: ['contrast', 'visibility', 'readability'],
        has_cta: true,
      },
    },

    // 6. Small fonts
    {
      id: 'small_fonts',
      name: 'Small Illegible Fonts',
      category: 'font_size',
      description: `Real estate billboard with font size issues. Arabic headline 'شقق فاخرة للبيع' (Luxury Apartments for Sale) at only 5 inches height. English 'LUXURY APARTMENTS FOR SALE' at 4 inches. Arabic is slightly larger but both are far too small for highway viewing at 100+ meters. Building rendering image takes up 70% of the billboard. Price '٢٥٠,٠٠٠ ر.ع.' at 3 inches. Contact details, location map, and agent photo all crammed into remaining space at 2 inches or smaller. Dark blue (#1A237E) text on light blue (#E3F2FD) background - decent contrast 6:1. Total 12 words. Text simply too small to read at speed.`,
      expected: {
        score_range: [3.0, 5.5],
        arabic_detected: true,
        arabic_is_primary: true,
        compliance_status: 'compliant',
        critical_issues_keywords: ['font', 'size', 'small', 'inches', 'readability'],
        has_cta: true,
      },
    },

    // 7. Mixed language (Arabic present but not primary)
    {
      id: 'mixed_language_partial',
      name: 'Mixed Language Partial Compliance',
      category: 'partial',
      description: `Restaurant billboard with mixed language hierarchy issue. English headline 'THE BEST BURGERS IN TOWN' at 14 inches in bold yellow (#FFD700) text. Arabic translation 'أفضل برجر في المدينة' at 10 inches below it in white. English is larger and more prominent. Red (#B71C1C) background. Large burger photograph in center. Price '$5.99' and Arabic '٢.٢٩ ر.ع.' both shown. Address and phone number at bottom. Good contrast ratio 12:1. Arabic IS present but English dominates visually. Total 9 words.`,
      expected: {
        score_range: [4.5, 6.5],
        arabic_detected: true,
        arabic_is_primary: false,
        compliance_status: 'partial',
        critical_issues_keywords: ['arabic', 'primary', 'dominant', 'compliance'],
        has_cta: true,
      },
    },

    // 8. Good CTA design
    {
      id: 'good_cta',
      name: 'Strong Call-to-Action Billboard',
      category: 'cta',
      description: `E-commerce promotional billboard with excellent CTA. Arabic headline 'تسوق الآن' (Shop Now) at 16 inches in bold white. English 'SHOP NOW' at 6 inches. Arabic clearly primary. Bright emerald green (#10B981) background. Large CTA button graphic showing 'اطلب الآن - ORDER NOW' with arrow icon. QR code prominently displayed with 'امسح للتسوق / SCAN TO SHOP' label. Website 'www.store.om' at 8 inches in contrasting yellow (#FFC107). Phone number with WhatsApp icon. Promotional text '20% OFF' in starburst. Total 8 words. Contrast ratio 15:1. Clear visual hierarchy directing to action.`,
      expected: {
        score_range: [7.0, 9.0],
        arabic_detected: true,
        arabic_is_primary: true,
        compliance_status: 'compliant',
        critical_issues_keywords: [],
        has_cta: true,
      },
    },

    // 9. Missing CTA
    {
      id: 'missing_cta',
      name: 'Missing Call-to-Action',
      category: 'cta',
      description: `Brand awareness billboard lacking CTA. Arabic headline 'الجودة في كل تفصيل' (Quality in Every Detail) at 15 inches in gold (#FFD700). English 'Quality in Every Detail' at 7 inches. Arabic dominant. Dark purple (#4A148C) background. Abstract geometric patterns. Brand name 'PREMIUM CO.' at 6 inches. High-quality product image of a watch. Good contrast 10:1. Clean design, Arabic compliant. BUT: No website, no phone number, no QR code, no social media, no store location, no 'visit us' or 'call now'. Total 6 words. Viewer has no idea how to take action or learn more.`,
      expected: {
        score_range: [5.5, 7.5],
        arabic_detected: true,
        arabic_is_primary: true,
        compliance_status: 'compliant',
        critical_issues_keywords: ['cta', 'call-to-action', 'contact', 'action'],
        has_cta: false,
      },
    },

    // 10. High-scoring exemplar
    {
      id: 'perfect_exemplar',
      name: 'Perfect Score Exemplar',
      category: 'exemplar',
      description: `Government health campaign billboard with perfect execution. Large Arabic headline 'صحتك أولاً' (Your Health First) at 22 inches in bold white (#FFFFFF), centered and commanding. English 'YOUR HEALTH FIRST' at 8 inches directly below, properly subordinate. Deep teal (#00695C) background - calming and professional. Ministry of Health logo with Arabic name 'وزارة الصحة' at 6 inches in top right. Simple icon of heart and stethoscope. Hotline number '٨٠٠٨٠٠٨٠' prominently displayed at 10 inches. QR code linking to health portal. Total 4 words of main message. Contrast ratio 18:1. Perfect hierarchy: Arabic 3x larger than English, clearly dominant. Ample white space. Professional, trustworthy, clear message. Fully compliant with Ordinance 25/93.`,
      expected: {
        score_range: [9.0, 10.0],
        arabic_detected: true,
        arabic_is_primary: true,
        compliance_status: 'compliant',
        critical_issues_keywords: [],
        has_cta: true,
      },
    },
  ];

  return {
    version: '1.0.0',
    generated_at: new Date().toISOString(),
    description: 'Billboard analysis evaluation dataset covering Arabic compliance, readability, contrast, and CTA scenarios for Oman market',
    test_cases: testCases,
  };
}

/**
 * Main entry point
 */
function main() {
  console.log('Generating billboard evaluation dataset...\n');

  const dataset = generateDataset();

  const outputPath = path.join(__dirname, 'dataset.json');
  fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2));

  console.log(`Generated ${dataset.test_cases.length} test cases:`);
  console.log('');

  for (const tc of dataset.test_cases) {
    const scoreRange = `${tc.expected.score_range[0]}-${tc.expected.score_range[1]}`;
    const arabic = tc.expected.arabic_detected ? 'Yes' : 'No';
    const status = tc.expected.compliance_status;
    console.log(`  [${tc.id}] ${tc.name}`);
    console.log(`    Category: ${tc.category} | Arabic: ${arabic} | Status: ${status} | Score: ${scoreRange}`);
  }

  console.log('');
  console.log(`Dataset saved to: ${outputPath}`);
}

main();
