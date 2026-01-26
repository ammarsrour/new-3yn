export const toArabicNumerals = (value: string | number): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const str = String(value);

  return str.replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
};

export const formatArabicNumber = (value: number, locale: string = 'en'): string => {
  if (locale === 'ar') {
    return toArabicNumerals(value);
  }
  return String(value);
};

export const formatArabicPrice = (price: number, locale: string = 'en'): string => {
  if (locale === 'ar') {
    return toArabicNumerals(price.toLocaleString('en-US'));
  }
  return price.toLocaleString('en-US');
};
