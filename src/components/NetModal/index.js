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
    const prod = window.prod;
    return (
      <Modal
          wrapClassName="self"
          title={prod ? lang['net.pro.title']: lang['net.dev.title']}
          visible={visible}
          onCancel={() =>this.setState({visible: false})}
          footer={null}
        >
          <p>{prod ? lang['net.pro.text'] : lang['net.dev.text']}</p>
        </Modal>
    );
  }
}

export default LoginModal;
