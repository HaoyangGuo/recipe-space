import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	const { data: session } = useSession();

	const handleMenuClick = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="w-screen bg-white flex justify-center">
			<div className="flex flex-col items-center w-screen sm:w-2/3 justify-between lg:h-14 p-1 lg:p-2 lg:flex-row">
				<Link href="/">
					<div className="flex items-center">
						<Image src="/icons/logo.png" alt="logo" height={40} width={40} />
						<div className="text-2xl font-bold sm:ml-3 cursor-pointer hover:text-blue-700">
							recipe space
						</div>
					</div>
				</Link>
				<div className="gap-10 font-semibold hidden lg:flex items-center">
					<Link href="/search">
						<a>Search</a>
					</Link>
					<Link href="/feed">
						<a>Post</a>
					</Link>
					<Link href="/feed">
						<a className="bg-green-600 text-white px-3 py-1 rounded">
							Check out what others made!
						</a>
					</Link>
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
								onClick={() => signOut()}
								layout="fixed"
							/>
						</div>
					) : (
						<button onClick={() => signIn()}>Login</button>
					)}
				</div>
				<div className="lg:hidden">
					{isOpen ? (
						<div className="flex flex-col p-3 rounded gap-2 transition-all duration-150 ease-linear items-center">
							<Link href="/search">
								<a>Search</a>
							</Link>
							<Link href="/feed">
								<a>Post</a>
							</Link>
							<Link href="/feed">
								<a>Feed</a>
							</Link>
							{session ? (
								<>
									<Link href={`/user/${session.id}`}>
										<a>{session.user?.name}</a>
									</Link>
									<button onClick={() => signOut()}>Logout</button>
								</>
							) : (
								<button onClick={() => signIn()}>Login</button>
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
