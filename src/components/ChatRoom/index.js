import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './style.scss';

import { Icon, List, Avatar, Row, Col, Tooltip, Popover, Form, Input, Button, message } from 'antd';
import 'emoji-mart/css/emoji-mart.css';
import { Picker, Emoji } from 'emoji-mart';

import tronConfig from '../../config/tronConfig';
import tronInit from '../../config/tronInit';

import { saveOrUpdateName } from '../../api';
import { getTronAddress } from '../../api/tronApi';
import { isArray } from 'util';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: tronConfig.iconLink,
});

class CharRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSmile: false,
      showEdit: false,
      nickname: '', // 昵称
      chatList: [], // 聊天记录
      wsRecord: null,
      wsNotice: null,
    }
  }
  componentWillMount() {
  }
  componentDidMount() {
    tronInit(() => {
      const ws = new WebSocket(`${tronConfig.wsUrl}/api/chart/${getTronAddress()}`);
      this.setState({wsRecord: ws});
      ws.onmessage = data => {
        let { chatList } = this.state;
        console.log(data, 'datadatadatadata');
        let result = JSON.parse(data.data);
        result = isArray(result) ? result : [result]
        this.setState({chatList: [...chatList, ...result]});
      };

    })
  }
  sendHandler() { // 发送信息
    const { wsRecord } = this.state;
    const { isTronLogin } = this.props.tronInfo;
    if(!isTronLogin) return message.warning('请先登录');
    let text = this.refs.divInput.innerHTML;
    console.log(text, 'texttexttexttexttext');
    wsRecord.send(text);
    this.refs.divInput.innerHTML = '';
  }

  handleVisibleChange(type, visible){
    this.setState({ [type]: visible });
  }
  emojiContent(){
    return (
      <Picker 
        set='emojione' 
        showPreview={false}
        onSelect={item => this.onSelect(item)}
      />
    )
  }
  editContent(){
    let { nickname } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" onSubmit={this.oneEditHandler}>
        <Form.Item>
          {getFieldDecorator('nickname', {
            rules: [{ required: true, message: 'Please input your nickname!' }],
          })(
            <Input placeholder="Nickname" />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    )
  }
  oneEditHandler = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        saveOrUpdateName({name: values.nickname}).then(res => {
          console.log(res, 'resresres')
          if(res.data.code === 200) {
            this.setState({
              showEdit: false
            })
            return message.success('昵称设置成功');
          }
          message.warning('昵称设置失败，请重试');
        }).catch(() => {
          return message.warning('昵称设置失败，请重试');
        }).finally(()=> {

        });
      }
    });
  }
  onSelect(item) { // 选择表情
    console.log(item, 'item', <span dangerouslySetInnerHTML={{
      __html: Emoji({
        html: true,
        emoji: item.colons,
        size: 16
      })
    }}></span>);
    // this.refs.divInput.innerHTML += item.native;
    this.refs.divInput.appendChild(<span dangerouslySetInnerHTML={{
      __html: Emoji({
        html: true,
        emoji: item.colons,
        size: 16
      })
    }}></span>);
  }
  divOnInput(e) { // 输入框输入
    console.log(window.event,'eeee');
  }
  render() {
    let { show, onClick } = this.props;
    let { showSmile, showEdit, chatList } = this.state;
    let data = chatList.map(chat => {
      return {
        title: chat.name,
        avatar: <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />,
        description: chat.msg
      }
    })
    return (
      <React.Fragment>
        <div className={`${styles['chat-wrapper']} ${show ? styles.show : null}`}>
          <div className={styles['chat-header']}>
            <span className={styles.title}>Duel</span>
            <Icon className={styles['colse-btn']} type="close-circle" onClick={() => onClick(false)} />
          </div>
          <div className={styles['chat-inner-wrap']}>
            <section className={styles['chat-inner']}>
              <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={item.avatar}
                      title={item.title}
                      description={item.description}
                    />
                  </List.Item>
                )}
              />
            </section>
          </div>
          <div className={styles['chat-footer']}>
            <Row type="flex" align="middle" gutter={5} style={{height: '100%'}}>
            <Col>
              <Popover
                  content={this.editContent()}
                  trigger="click"
                  visible={showEdit}
                  onVisibleChange={show => this.handleVisibleChange('showEdit', show)}
                >
                  <Tooltip placement="topLeft" title="Set nickname">
                    <Icon type="edit" theme="filled" className={styles.icon} />
                  </Tooltip>
                </Popover>
              </Col>
              <Col style={{flex: 1}}>
                <div 
                  className={styles.input} 
                  contentEditable="true" 
                  onInput={e => this.divOnInput(e)}
                  ref="divInput"
                >
                </div>
              </Col>
              <Col>
                <Popover
                  content={this.emojiContent()}
                  trigger="click"
                  visible={showSmile}
                  onVisibleChange={show => this.handleVisibleChange('showSmile', show)}
                >
                  <Tooltip placement="top" title="Smiles">
                    <Icon className={styles.icon} type="smile" theme="filled" />
                  </Tooltip>
                </Popover>
                <Tooltip placement="topRight" title="Send">
                  <IconFont onClick={() => {this.sendHandler()}} className={styles.icon} type="icon-planenormal"/>
                </Tooltip>
              </Col>
            </Row>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const WrappedCharRoom= Form.create({ name: 'set_nickname' })(CharRoom);
export default connect(state => {
  return {
    langInfo: state.lang,
    tronInfo: state.tronInfo
  }
})(WrappedCharRoom);
