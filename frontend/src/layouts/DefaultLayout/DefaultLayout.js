import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const DefaultLayout = ({ userData, children }) => {
  return (
    <div className="d-flex flex-column">
      <Header userData={userData}/>
      <main className="bg-black">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;