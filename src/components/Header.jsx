import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Header = ({ className = "" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const onLogOutClick = useCallback(() => {
    localStorage.removeItem("userRole");
    navigate("/");
  }, [navigate]);

  const onProfileClick = useCallback(() => {
    navigate("/profile"); // Customize this route as needed
  }, [navigate]);

  return (
    <header
      className={`relative w-full py-2 bg-[#d56a08] box-border ${className} mq750:mt-5 mq750:bg-[#efefef]`}
    >
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto font-dm-sans font-bold">
        {/* DashBoard Title */}
        <div className="absolute left-0 ml-8 text-black text-1xl mq750:ml-10">
          <span className="bg-gradient-to-r from-blue-500 to-teal-500 text-transparent bg-clip-text text-[30px]">
            DashBoard
          </span>
        </div>
        {/* Greeting */}
        <div className="flex-1 text-center text-white text-[25px] hidden lg:block">
          <span>Hello {localStorage.getItem("userRole")}</span>
        </div>
        {/* Hamburger Menu */}
        <div className="absolute right-0 mr-8">
          <button
            className="text-white bg-transparent border-none outline-none cursor-pointer text-[25px] mq750:text-black"
            onClick={toggleMenu}
          >
            ☰
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg z-10">
              <button
                className="block px-5 py-2 text-left w-full text-black cursor-pointer hover:bg-blue-200 font-bold shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-[15px]"
                onClick={onProfileClick}
              >
                Profile
              </button>
              <button
                className="block px-3 py-2 text-left w-full text-black cursor-pointer hover:bg-red-400 font-bold shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-[15px]"
                onClick={onLogOutClick}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;
