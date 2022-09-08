import React from "react";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className="flex justify-center">
			<div className="w-5/6 sm:w-2/3 p-2">{children}</div>
		</div>
	);
};

export default Layout;
