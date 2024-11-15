import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const DefaultLayout = ({ userData, children }) => {
  return (
    <div class="d-flex flex-column">
      <Header userData={userData} />
      {/* <div class="d-flex"> */}
        <main class="flex-grow-1 p-3 bg-black">
          {children}
        </main>
      {/* </div> */}
      <Footer />
    </div>
  );
};

export default DefaultLayout;