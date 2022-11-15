import React from 'react';
import { render, screen } from '@testing-library/react';
import { SideMenu, RegisterButton, SignInButton } from '../component/SideMenu';
import { shallow } from 'enzyme';

describe('SideMenu', () => {
  it('renders side logins', () => {
    render(<SideMenu/>)
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders menu button', () => {
    render(<SideMenu showMenu={true}/>)
    expect(screen.getByRole('button')).toBeInTheDocument();
    // Check that the register and sign in buttons are not rendered
    expect(screen.queryByText(/register/i)).toBeNull();
    expect(screen.queryByText(/sign in/i)).toBeNull();
  });

  it('triggers register onClick when clicked', () => {
    const click = jest.fn();
    const wrapper = shallow(<RegisterButton onClick={click}/>);
    wrapper.simulate('click');
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('triggers signIn onClick when clicked', () => {
    const click = jest.fn();
    const wrapper = shallow(<SignInButton onClick={click}/>);
    wrapper.simulate('click');
    expect(click).toHaveBeenCalledTimes(1);
  });
})
