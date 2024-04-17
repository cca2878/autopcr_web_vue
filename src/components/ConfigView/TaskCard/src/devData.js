const devConfigInfo = {
  config: {
    force_stop_heart_sweep: {
      candidates: ['n2', 'n3', 'n4及以上'],
      config_type: 'multi',
      default: ['n2'],
      desc: '不刷心碎庆典',
      key: 'force_stop_heart_sweep'
    },
    sweep_recover_stamina_times: {
      candidates: [0, 1, 2],
      config_type: 'int',
      default: 0,
      desc: '平时氪体数',
      key: 'sweep_recover_stamina_times'
    },
    hatsune_hboss_strategy: {
      candidates: ['保留当日vh份', '保留当日及未来vh份'],
      config_type: 'single',
      default: '保留当日vh份',
      desc: '扫荡策略',
      key: 'hatsune_hboss_strategy'
    },
    seasonpass_reward_stamina_exclude: {
      candidates: [true, false],
      config_type: 'bool',
      default: true,
      desc: '不领取体力',
      key: 'seasonpass_reward_stamina_exclude'
    },
    time_cron1: {
      candidates: [],
      config_type: 'time',
      default: '00:00',
      desc: '执行时间',
      key: 'time_cron1'
    }
  },
  config_order: [
    'force_stop_heart_sweep',
    'time_cron1',
    'sweep_recover_stamina_times',
    'seasonpass_reward_stamina_exclude',
    'hatsune_hboss_strategy'
  ],
  description: 'devConfigSampleDesc',
  implemented: true,
  key: 'devConfigSampleKey',
  name: 'devConfigSampleName',
  runnable: false,
  stamina_relative: false,
  text_result: false
}

const devConfig = {
  devConfigSampleKey: true,
  time_cron1: '00:00',
  seasonpass_reward_stamina_exclude: true,
  hatsune_hboss_strategy: '保留当日vh份',
  sweep_recover_stamina_times: 0,
  force_stop_heart_sweep: []
}

export { devConfigInfo, devConfig }
