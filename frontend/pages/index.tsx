import type { NextPage } from 'next';
import { useCallback } from 'react';
import { SiweMessage } from 'siwe';
import { useAccount, useConnect, useNetwork, useSignMessage } from 'wagmi';
import { createSiweMessage, verifySiweMessage } from '../utils';

const Home: NextPage = () => {
  const [{ data, error }, connect] = useConnect();
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });
  const { connected } = data;
  const [, signMessage] = useSignMessage();
  const [{ data: networkData }] = useNetwork();

  const signIn = useCallback(async () => {
    try {
      const address = accountData?.address;
      const chainId = networkData?.chain?.id;
      if (!address || !chainId) return;

      const message = await createSiweMessage(
        address,
        'Sign in with Ethereum to the app.',
        window.location.host,
        window.location.origin,
        chainId
      );

      const signRes = await signMessage({ message });
      if (signRes.error) throw signRes.error;

      // Verify signature
      const verifyRes = await verifySiweMessage(message, signRes.data);
      if (!verifyRes.ok) throw new Error('Error verifying message');
    } catch (error) {
      console.error({ error });
    }
  }, [accountData?.address, networkData?.chain?.id, signMessage]);

  if (connected) {
    return (
      <div className='py-24 text-center'>
        <p className='text-2xl font-bold'>
          Welcome {accountData?.ens?.name || accountData?.address}
        </p>
        <button className='mx-auto mt-10' onClick={disconnect}>
          Disconnect
        </button>
        <button onClick={signIn}>Sign in</button>
      </div>
    );
  }

  return (
    <div className='py-24 text-center'>
      <h1 className='text-2xl font-bold'>Welcome to dForms</h1>
      <p className='mt-10'>Connect your wallet:</p>
      <div className='mt-5 flex justify-center gap-6'>
        {data.connectors.map((x) => (
          <button
            className='rounded bg-slate-200 p-2'
            key={x.id}
            onClick={() => connect(x)}
          >
            {x.name}
            {!x.ready && ' (unsupported)'}
          </button>
        ))}
      </div>

      {error && (
        <p className='text-red-500'>{error?.message ?? 'Failed to connect'}</p>
      )}
    </div>
  );
};

export default Home;
