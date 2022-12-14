import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";
import Head from "next/head";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<>
			<SessionProvider session={session}>
				<QueryClientProvider client={new QueryClient()}>
					<Head>
						<link rel="recipe space icon" href="/image/favicon.ico" />
						<title>Recipe Space</title>
					</Head>
					<Navbar />
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</QueryClientProvider>
			</SessionProvider>
		</>
	);
}

export default MyApp;
