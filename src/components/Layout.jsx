// Layout.js
import React from 'react';

const Layout = ({ children }) => {
    return (
        <main className="mx-auto grid h-[100vh] w-[100vw] md:grid-cols-[20%_50%_30%]">
            {children}
        </main>
      );
};

export default Layout;
