import React, { Component } from 'react';
import { connect } from 'dva';

import styles from './style.scss';

import { Row, Col, Menu, Dropdown, Icon, Modal, Table, message, Drawer } from 'antd';

import langList from '../../locales/lang_list';

import Btn from '../Btn';
import Loading from '../Loading';
import LoginModal from '../LoginModal';

import { promoterRecordsList } from '../../api';

import { getPromoterBalances, promoterWithdraw } from '../../api/tronApi';

import miningData from '../MiningInfo/miningData';

class Header extends Component {
  constructor(props) {
    super(props)
    const { langInfo: {lang} } = this.props;
    this.state = {
      loginModalVisible: false,
      playVisible: false,
      roadmapVisible: false,
      tokenVisible: false,
      miningVisible: false,
      promoterVisible: false,
      promoteList: [],
      promoteLoading: false,
      promoteBalances: '',
      promoteColumns: [
        {
          title: `${lang['promoter.table.time']}（UTC+8）`,
          dataIndex: 'createdAt',
          width: '30%'
        },{
          title: lang['promoter.table.address'],
          dataIndex: 'address',
          width: '50%',
          align: 'center'
        },{
          title: lang['promoter.table.amount'],
          dataIndex: 'amount',
          width: '20%',
          align: 'center'
        }
      ],
      promotePage: 1,
      promoteLimit: 30,
      withdrawLoading: false,
      drawerVisible: false // 移动端菜单栏
    }
  }
  componentWillMount() {
  }
  getPromoterInfo() {
    let { promotePage, promoteLimit } = this.state;
    this.setState({promoteLoading: true})
    promoterRecordsList({page: promotePage, limit: promoteLimit}).then(res =>{
      this.setState({promoteList: res.data.body, promoteLoading: false});
    })
    getPromoterBalances().then(balance => {
      this.setState({promoteBalances: balance});
    })
  }
  showModal(key, callBack) {
    this.setState({
      [key]: true,
    });
    callBack && callBack();
  }
  cancelModal(key) {
    this.setState({
      [key]: false,
    });
  }
  menu() {
    const { langInfo: {lang} } = this.props;
    return (
    <Menu>
      <Menu.Item>
        <a target="_blank" onClick={() => this.showModal('playVisible')}>{lang['header.play']}</a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" onClick={() => this.showModal('roadmapVisible')}>{lang['header.roadmap']}</a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" onClick={() => this.showModal('tokenVisible')}>{lang['header.token']}</a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" onClick={() => this.showModal('miningVisible')}>{lang['header.mining']}</a>
      </Menu.Item>
    </Menu>
  )};
  langMenu() {
    return (
      <Menu onClick={e => this.langMenuClick(e)}>
        {Object.entries(langList).map(([key, value]) => 
          <Menu.Item key={key}>
            <a className={styles['lang-menu']}><img src={require(`../../assets/images/${key}.png`)} />{value}</a>
          </Menu.Item>
        )}
      </Menu>
  )};
  langMenuClick(e) {
    let lang = e.key;
    window.localStorage.setItem('lang', lang);
    window.location.reload();
  }
  withdraw() {
    this.setState({withdrawLoading: true});
    promoterWithdraw().then(() => {
      message.success('Withdrawal success');
      this.setState({withdrawLoading: false});
    }).catch(() => {
      message.error('Withdrawal failure');
      this.setState({withdrawLoading: false});
    })
  }
  copy() {
    let input = document.getElementById('shareLink');
    input.select();
    document.execCommand("Copy");
    message.success('Copy success')
  }
  loginModalHandler() {
    this.setState({loginModalVisible: false});
  }
  render() {
    const { langInfo: {lang, currentLang}, tronInfo } = this.props;
    let { playVisible, drawerVisible, roadmapVisible, tokenVisible, miningVisible, promoterVisible, promoteColumns, promoteList, promoteLoading, promoteBalances, withdrawLoading, loginModalVisible } = this.state;
    let shareLink = `${window.location.origin}?from=${tronInfo.tronAddress}`;
    let address = tronInfo.tronAddress && `${tronInfo.tronAddress.slice(0, 5)}...${tronInfo.tronAddress.slice(-5)}`
    return (
      <React.Fragment>
        <header className={`${styles.header} animate`}>
          <div className="container">
            <Row className={styles.row} type="flex" align="middle">
              <Col className={styles.left}>
                <img className={styles['logo']} src={require('../../assets/images/logo.png')} alt="logo" />
              </Col>
              <Col className={`${styles.center} hidden-sm`}>
                <Row type="flex">
                  <Col>
                    <div className={styles['nav-cell']} onClick={() => this.showModal('promoterVisible', () => this.getPromoterInfo())}>{lang['header.promoter']}</div>
                  </Col>
                  <Col>
                    <Dropdown overlay={this.menu()} placement="bottomRight" overlayClassName="self">
                      <div className={styles['nav-cell']}>{lang['header.introduction']} <Icon type="down" /></div>
                    </Dropdown>
                  </Col>
                </Row>
              </Col>
              <Col className={`${styles.center} show-sm`}></Col>
              <Col className={styles.right}>
                {
                  tronInfo.isTronLogin ? 
                  <div className={styles.userInfo}>
                    <div className={styles.address}>{address}</div>
                    <div className={styles.balance}>{tronInfo.tronBalance} TRX</div>
                  </div> : <div className={styles['to-login']} onClick={() => {this.setState({loginModalVisible: true})}}>{lang['header.login']}</div>
                }
              </Col>
              <Col className={styles.right}>
                <Dropdown overlay={this.langMenu()} placement="bottomRight" overlayClassName="self">
                  <div className={styles['lang-item']}><img src={require(`../../assets/images/${currentLang}.png`)} /> <Icon type="down" /></div>
                </Dropdown>
              </Col>
              <Col className={`${styles.right} show-sm`}>
                  <div className={styles['mobile-menu']} onClick={() => this.showModal('drawerVisible')}><Icon type="bars" /></div>
                  <Drawer
                    title=""
                    placement="top"
                    className="self"
                    onClose={() => this.cancelModal('drawerVisible')}
                    visible={drawerVisible}
                  >
                    <ul className={styles['m-drawer']}>
                      <li><span onClick={() => this.showModal('promoterVisible', () => this.getPromoterInfo())}>{lang['header.promoter']}</span></li>
                      <li><span onClick={() => this.showModal('playVisible')}>{lang['header.play']}</span></li>
                      <li><span onClick={() => this.showModal('roadmapVisible')}>{lang['header.roadmap']}</span></li>
                      <li><span onClick={() => this.showModal('tokenVisible')}>{lang['header.token']}</span></li>
                      <li><span onClick={() => this.showModal('miningVisible')}>{lang['header.mining']}</span></li>
                    </ul>
                  </Drawer>
              </Col>
            </Row>
          </div>
        </header>

        {/* 怎么玩 */}
        <Modal
          wrapClassName="self"
          title={lang['header.play']}
          visible={playVisible}
          onCancel={() =>this.cancelModal('playVisible')}
          footer={null}
        >
          <p>{lang['play.text1-1']}
            <a href="https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec" target="_blank">Tronlink</a>
            {lang['play.text1-2']}
            <a href="https://dwz.cn/FyIuFVay" target="_blank">TronPay</a>{lang['play.text1-3']}
          </p>
          <p>{lang['play.text2']}</p>
          <p>{lang['play.text3']}</p>
          <p>{lang['play.text4']}</p>
          <p>{lang['play.text5']}</p>
        </Modal>

        {/* 路径图 */}
        <Modal
          wrapClassName="self"
          title={lang['header.roadmap']}
          visible={roadmapVisible}
          onCancel={() =>this.cancelModal('roadmapVisible')}
          footer={null}
        >
          <p><span className="text-title">{lang['roadmap.text1-1']}</span>{lang['roadmap.text1-2']}</p>
          <p><span className="text-title">{lang['roadmap.text2-1']}</span>{lang['roadmap.text2-2']}</p>
          <p><span className="text-title">{lang['roadmap.text3-1']}</span>{lang['roadmap.text3-2']}</p>
        </Modal>

        {/* duel token */}
        <Modal
          wrapClassName="self"
          title={lang['header.token']}
          visible={tokenVisible}
          onCancel={() =>this.cancelModal('tokenVisible')}
          footer={null}
        >
          <p><span className="text-title">{lang['token.text1-1']}</span><br/>{lang['token.text1-2']}</p><br/>
          <p><span className="text-title">{lang['token.text2-1']}</span><br/>{lang['token.text2-2']}</p>
          <p>{lang['token.text2-3']}</p>
          <p>{lang['token.text2-4']}</p>
          <p>{lang['token.text2-5']}</p>
          <p>{lang['token.text2-6']}</p>
          <p>{lang['token.text2-7']}</p>
        </Modal>

        {/* 人人都是推广员 */}
        <Modal
          wrapClassName="self"
          title={lang['header.promoter']}
          visible={promoterVisible}
          onCancel={() =>this.cancelModal('promoterVisible')}
          footer={null}
        >
          <p>{lang['promoter.text1']}</p>
          <div className={styles['share-wrap']}>
            <p>{lang['promoter.text2']}</p>
            <div><a href={shareLink} target="_blank">{shareLink}</a></div>
            <input className={styles['share-input']} type="text" value={shareLink} onChange={() => {}} id="shareLink" />
            <div className={styles['share-btn']}><Btn onClick={() => this.copy()}>{lang['promoter.share']}</Btn></div>
          </div>
          <p className={styles.tip}>{lang['promoter.tip']}</p>
          <div className={styles['reward-wrap']}>
            <Row gutter={10} type="flex" align="top">
              <Col style={{flex: 1}}>
                  <div className={styles['get-trx']}>
                    <img src={require('../../assets/images/tronweb.png')} />{lang['promoter.balance']} {promoteBalances}
                  </div>
              </Col>
              <Col>
                <Btn onClick={() => this.withdraw()} loading={withdrawLoading}>{lang['promoter.extract']}</Btn>
              </Col>
            </Row>
          </div>
          <div className={styles['promote-wrap']}>
            <p>{lang['promoter.record']}</p>
            <Loading loading={promoteLoading} data={promoteList}>
              <Table
                columns={promoteColumns} 
                dataSource={promoteList} 
                pagination={false} 
                scroll={{ y: 320 }}
                loading={promoteLoading}
              />
            </Loading>
          </div>
        </Modal>

        {/* 挖矿介绍 */}
        <Modal
          wrapClassName="self"
          title={lang['header.mining']}
          visible={miningVisible}
          onCancel={() =>this.cancelModal('miningVisible')}
          footer={null}
        >
          <p>{lang['mining.text1']}</p>
          <p>{lang['mining.text2']}</p>
          <p>{lang['mining.text3']}</p><br />
          <p>{lang['mining.text6']}<span className="text-title">10,000,000,000 * 50% = 5,000,000,000</span></p>
          <p>{lang['mining.text7']}</p>
          <p>{lang['mining.text8']}</p>
          <table className={styles['mining-table']}>
            <tbody>
              <tr>
                <td>{lang['mining.phase']}</td>
                <td>{lang['mining.get.duel']}</td>
                <td>{lang['mining.now.amount']}</td>
              </tr>
              {miningData.map(item =>(
                <tr key={item.mining}>
                  <td>{item.mining}</td>
                  <td>{item.key}</td>
                  <td>{(item.val).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
        <LoginModal out={true} show={loginModalVisible} onClick={this.loginModalHandler.bind(this)} />
      </React.Fragment>
    );
  }
}

export default connect(state => {
  return {
    langInfo: state.lang,
    tronInfo: state.tronInfo
  }
})(Header);
