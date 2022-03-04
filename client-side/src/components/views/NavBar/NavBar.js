import React, { useState } from "react";
import LeftMenu from "./Sections/LeftMenu";
import RightMenu from "./Sections/RightMenu";
import { Drawer, Button, Icon } from "antd";
import "./Sections/Navbar.css";

function NavBar() {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleSearch = e => {
    e.preventDefault();
    window.location.href = `/search?q=${search}`
  };

  return (
    <nav
      className='menu'
      style={{ position: "fixed", zIndex: 5, width: "100%" }}
    >
      <div className='menu__logo'>
        <a href='/'>ShowFlix</a>
      </div>
      <form onSubmit={handleSearch} className="menu_search_form">
        <input type="text" className="menu__search_input" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
      </form>
      <div className='menu__container'>
        <div className='menu_left'>
          <LeftMenu mode='horizontal' />
        </div>
        <div className='menu_rigth'>
          <RightMenu mode='horizontal' />
        </div>
        <Button
          className='menu__mobile-button'
          type='primary'
          onClick={showDrawer}
        >
          <Icon type='align-right' />
        </Button>
        <Drawer
          title='Basic Drawer'
          placement='right'
          className='menu_drawer'
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <LeftMenu mode='inline' />
          <RightMenu mode='inline' />
        </Drawer>
      </div>
    </nav>
  );
}

export default NavBar;
