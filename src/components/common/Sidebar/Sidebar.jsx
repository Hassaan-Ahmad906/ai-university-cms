import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import './Sidebar.css';

const SidebarItem = ({ item, collapsed }) => {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `pu-sidebar__item ${isActive ? 'active' : ''}`
      }
      end={item.path === '/'}
    >
      {item.icon && (
        <span className="pu-sidebar__item-icon" aria-hidden="true">
          {item.icon}
        </span>
      )}
      <span className="pu-sidebar__item-label">{item.label}</span>
      {collapsed && (
        <span className="pu-sidebar__tooltip">{item.label}</span>
      )}
    </NavLink>
  );
};

const SidebarGroup = ({ item, collapsed }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="pu-sidebar__group">
      <button
        className="pu-sidebar__group-header"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        {item.icon && (
          <span className="pu-sidebar__group-icon" aria-hidden="true">
            {item.icon}
          </span>
        )}
        <span className="pu-sidebar__group-label">{item.label}</span>
        <span
          className={`pu-sidebar__group-chevron ${
            isOpen ? 'pu-sidebar__group-chevron--open' : ''
          }`}
        >
          <ChevronRight />
        </span>
        {collapsed && (
          <span className="pu-sidebar__tooltip">{item.label}</span>
        )}
      </button>
      <div
        className={`pu-sidebar__group-children ${
          isOpen ? 'pu-sidebar__group-children--open' : ''
        }`}
      >
        {item.children.map((child, index) => (
          <SidebarItem key={child.path || index} item={child} collapsed={false} />
        ))}
      </div>
    </div>
  );
};

const Sidebar = ({
  menuItems = [],
  collapsed = false,
  onToggle,
  user = {},
  roleBadge,
  mobileOpen = false,
  onMobileClose,
  className = '',
}) => {
  const sidebarClasses = [
    'pu-sidebar',
    collapsed ? 'pu-sidebar--collapsed' : 'pu-sidebar--expanded',
    mobileOpen && 'pu-sidebar--mobile-open',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`pu-sidebar-overlay ${
          mobileOpen ? 'pu-sidebar-overlay--visible' : ''
        }`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <aside className={sidebarClasses} aria-label="Main navigation">
        {/* Logo */}
        <div className="pu-sidebar__logo">
          <div className="pu-sidebar__logo-monogram">PU</div>
          <span className="pu-sidebar__logo-text">PU CMS</span>
          <button className="pu-sidebar__toggle" onClick={onToggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            <ChevronLeft />
          </button>
        </div>

        {/* Role Badge */}
        {roleBadge && !collapsed && (
          <div style={{ padding: '0.5rem 0.75rem' }}>
            <span className="pu-sidebar__role-badge">{roleBadge}</span>
          </div>
        )}

        {/* Navigation */}
        <nav className="pu-sidebar__nav">
          {menuItems.map((item, index) => {
            if (item.children && item.children.length > 0) {
              return (
                <SidebarGroup
                  key={item.path || index}
                  item={item}
                  collapsed={collapsed}
                />
              );
            }
            return (
              <SidebarItem
                key={item.path || index}
                item={item}
                collapsed={collapsed}
              />
            );
          })}
        </nav>

        {/* User Profile */}
        {user.name && (
          <div className="pu-sidebar__profile">
            <div className="pu-sidebar__profile-content">
              <div className="pu-sidebar__profile-avatar">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 'inherit',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <div className="pu-sidebar__profile-info">
                <div className="pu-sidebar__profile-name">{user.name}</div>
                {user.role && (
                  <div className="pu-sidebar__profile-role">{user.role}</div>
                )}
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
