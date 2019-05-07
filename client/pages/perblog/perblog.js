Page({
  onClose(event) {
    const { position, instance } = event.detail;
    switch (position) {
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？'
        }).then(() => {
          instance.close();
        });
        break;
    }
  }
  
}
);
