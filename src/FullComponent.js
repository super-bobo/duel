import ReactDOM from 'react-dom';
import React from 'react';

import FullLoading from './components/FullLoading';
import LoginModal from './components/LoginModal';
import NetModal from './components/NetModal';

let Components = {
  fullLoading: <FullLoading />,
  loginModal: <LoginModal />,
  netModal: <NetModal />
}

const Loading = {
  init(id, name) {
    const div = document.createElement('div');
    div.id = id;
    document.body.appendChild(div);
    ReactDOM.render(Components[name], div);
  },
  remove(id) {
    const div = document.getElementById(id);
    if(div) {
      ReactDOM.unmountComponentAtNode(div);
      document.body.removeChild(div);
    }
  }
};

export default Loading;