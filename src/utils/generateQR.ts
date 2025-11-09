// utils/generateQR.ts
export const generateVietQR = (
  account: string,
  amount?: number,
  note?: string
) => {
  const bankCode = "VCB"; // Timo dùng OCB
  const template = "compact"; // có thể đổi sang 'logo' hoặc 'print' nếu muốn
  const params = new URLSearchParams();

  if (amount) params.append("amount", amount.toString());
  if (note) params.append("addInfo", note);

  return `https://img.vietqr.io/image/${bankCode}-${account}-${template}.png?${params.toString()}`;
};
