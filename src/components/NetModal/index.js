import React, { Component } from 'react';

import { Modal } from 'antd';

import FullLang from '../../locales/FullLang';


class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }
  componentWillMount() {
    this.setState({lang: FullLang});
    setTimeout(() => {
      this.setState({visible: true})
    }, 10)
  }
  render() {
    let {visible, lang} = this.state;
    const dev = window.dev;
    return (
      <Modal
          wrapClassName="self"
          title={dev ? lang['net.dev.title']: lang['net.pro.title']}
          visible={visible}
          onCancel={() =>this.setState({visible: false})}
          footer={null}
        >
          <p>{dev ? lang['net.dev.text'] : lang['net.pro.text']}</p>
        </Modal>
    );
  }
}

export default LoginModal;
