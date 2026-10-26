import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import '@/styles/globals.css';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

