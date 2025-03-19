import React from "react";
import Button from 'react-bootstrap/Button';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { googleLogout } from '@react-oauth/google';
import { CiLogin } from "react-icons/ci";
import { TbLogout } from 'react-icons/tb';
import { FiPackage } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";

const User = () => {

    const user= JSON.parse(localStorage.getItem('user'));
    const token= localStorage.getItem('token');

    const popover = (
        <Popover id="popover-basic">
          <Popover.Body>
            
            <Button variant="outline" onClick={()=>{ window.location.href = '/orders'; }}
                    className="flex items-center bg-white p-4" style={{width:'100%'}}>
              <FiPackage style={{ marginRight: '10px' }} />
              Orders
            </Button>
            <hr />
            
            <Button variant="outline" onClick={()=>{ window.location.href = '/account'; }}
                    className="flex items-center bg-white p-4" style={{width:'100%'}}>
              <IoSettingsOutline style={{ marginRight: '10px' }} />
              Settings
            </Button>
            <hr />

            <Button variant="outline" onClick={()=>{ googleLogout();
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = '/';
                    }} 
                    className="w-100 flex items-center bg-white p-4" style={{width:'100%', borderRadius:'0px 0px 15px 15px'}} >
              <TbLogout style={{ marginRight: '10px' }} />
              Sign Out
            </Button>
          
          </Popover.Body>
        </Popover>
      );


    return (
        <div className="relative">
            {user ? (

                <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
                    <img src={user?.picture} alt={user?.name} className="w-8 h-8 rounded-full object-cover" style={{cursor:'pointer'}} />
                </OverlayTrigger>

            ) : (
                <button 
                    className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-4 rounded-full flex items-center"
                    onClick={() => window.location.href = '/login'}
                >
                    Login <CiLogin className="text-xl" />
                </button>
            )}
        </div>
    );
};

export default User;
