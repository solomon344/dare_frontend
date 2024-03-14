import React from 'react';
import Logo from '../../assets/logo.svg'
import {Navbar,
        NavbarBrand,
        NavbarContent,
        NavbarItem,
        NavbarMenuToggle,
        NavbarMenu,
        NavbarMenuItem,
        Image,
        Link
    } from "@nextui-org/react";

const NavBar = () =>{

    return (
    <>
    <Navbar className='p-2 w-full border-b' isBlurred>
        <NavbarBrand className='h-full'>
            <Image className='h-[70px]' src={Logo}/>
        </NavbarBrand>

       <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
           About Us
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Contact
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Settings
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    </>
    )
}

export default NavBar