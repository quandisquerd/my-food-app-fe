const accountBank = import.meta.env.VITE_ACCOUNT_BANK;
export const generateVietQR = (
  account: string,
  amount?: number,
  note?: string
) => {
  const bankCode = accountBank; 
  const template = "compact"; 
  const params = new URLSearchParams();

  if (amount) params.append("amount", amount.toString());
  if (note) params.append("addInfo", note);

  return `https://img.vietqr.io/image/${bankCode}-${account}-${template}.png?${params.toString()}`;
};
