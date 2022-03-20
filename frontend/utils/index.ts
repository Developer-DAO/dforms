import { SiweMessage } from 'siwe';

const API_URL = 'http://127.0.0.1:3000';

export const getNonce = () => {
  return fetch(`${API_URL}/nonce`).then((res) => res.text());
};

export const createSiweMessage = async (
  address: string,
  statement: string,
  domain: string,
  uri: string,
  chainId: number
) => {
  const nonce = await getNonce();
  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri,
    version: '1',
    chainId,
    nonce,
  });
  return message.prepareMessage();
};

export const verifySiweMessage = async (message: string, signature: string) => {
  console.log(API_URL);
  const res = await fetch(`${API_URL}/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, signature }),
    credentials: 'include',
  });
  console.log(await res.text());
  return res;
};
