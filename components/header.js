import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

const Header = () => {
    return (
        <Menu style={{ marginTop: '10px' }}>
            <Link legacyBehavior route="/">
                <a className="item">EventCoin</a>
            </Link>
            <Menu.Menu position="right">
                <Link legacyBehavior route="/">
                    <a className="item">Events</a>
                </Link>

                <Link legacyBehavior route="/events/new">
                    <a className="item">+</a>
                </Link>
            </Menu.Menu>
        </Menu>
    );
};

export default Header;
