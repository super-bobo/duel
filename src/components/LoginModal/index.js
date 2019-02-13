import React, { Component } from 'react';

import { Modal } from 'antd';

// import styles from './style.scss';
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
  cancel() {
    let {onClick} = this.props;
    this.setState({visible: false});
    onClick && onClick();
  }
  render() {
    let {visible, lang} = this.state;
    let {show, out} = this.props;
    let bol = out ? show : visible;
    return (
      <Modal
          wrapClassName="self"
          title={lang['login.modal.title']}
          visible={bol}
          onCancel={() =>this.cancel()}
          footer={null}
        >
          <p>{lang['login.modal.text1']}</p>
          <p>Tron Link: <a href="https://goo.gl/Yb4NRU" target="_blank">https://goo.gl/Yb4NRU</a></p>
          <p>Tron Pay: <a href="https://dwz.cn/FyIuFVay" target="_blank">https://dwz.cn/FyIuFVay</a></p><br/>
          <p>{lang['login.modal.text2']}</p>
        </Modal>
    );
  }
}

export default LoginModal;
