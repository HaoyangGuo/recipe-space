import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	const router = useRouter();

	const { data: session, status } = useSession();

	const handleMenuClick = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="w-screen bg-white flex justify-center sticky top-0 z-50">
			<div className="flex flex-col items-center w-screen sm:w-2/3 justify-between p-2 lg:flex-row">
				<Link href="/">
					<div className="flex items-center">
						<Image src="/icons/logo.png" alt="logo" height={40} width={40} />
						<div className="text-2xl font-bold sm:ml-3 cursor-pointer hover:text-blue-700">
							recipe space
						</div>
					</div>
				</Link>
				<div className="gap-10 hidden lg:flex items-center">
					<Link href="/search">
						<a>Search</a>
					</Link>
					<Link href="/feed">
						<a>Share</a>
					</Link>
					<Link href="/feed">
						<a className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
							Check out what others made!
						</a>
					</Link>
					{status === "loading" ? (
						<div>Loading...</div>
					) : (
						<div>
							{session ? (
								<div className="flex items-center gap-2">
									<Link href={`/user/${session.id}`}>
										<a>{session.user?.name}</a>
									</Link>
									<Image
										className="cursor-pointer"
										src={"/icons/logout.png"}
										alt="logout"
										height={20}
										width={20}
										onClick={() => {
											signOut();
										}}
										layout="fixed"
									/>
								</div>
							) : (
								<button onClick={() => signIn("google")}>Login</button>
							)}
						</div>
					)}
				</div>
				<div className="lg:hidden">
					{isOpen ? (
						<div className="flex flex-col p-3 rounded gap-2 transition-all duration-150 ease-linear items-center">
							<Link href="/search">
								<a onClick={handleMenuClick}>Search</a>
							</Link>
							<Link href="/feed">
								<a onClick={handleMenuClick}>Share</a>
							</Link>
							<Link href="/feed">
								<a onClick={handleMenuClick}>Feed</a>
							</Link>

							{session ? (
								<>
									<Link href={`/user/${session.id}`}>
										<a onClick={handleMenuClick}>{session.user?.name}</a>
									</Link>
									<button
										onClick={() => {
											signOut();
										}}
									>
										Logout
									</button>
								</>
							) : (
								<button
									onClick={() => {
										signIn("google");
										handleMenuClick();
									}}
								>
									Login
								</button>
							)}

							<div className="rotate-180 cursor-pointer">
								<Image
									src={"/icons/menu.png"}
									alt="dropdown"
									height={25}
									width={25}
									onClick={handleMenuClick}
								/>
							</div>
						</div>
					) : (
						<div className="cursor-pointer transition-all duration-150 ease-linear">
							<Image
								src={"/icons/menu.png"}
								alt="dropdown"
								height={25}
								width={25}
								onClick={handleMenuClick}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default Navbar;
