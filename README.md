# ceshi

## Range DateTime Picker Demo

本项目是一个使用 **React + TypeScript + TailwindCSS** 实现的 Antd 风格双面板 RangeDateTimePicker 示例。

## 为什么移除仓库内的 zip 文件

部分代码托管/评审界面在“创建拉取请求”流程中不支持二进制文件预览，仓库中直接提交 `*.zip` 可能触发“**不支持二进制文件**”提示。

因此当前仓库不再跟踪压缩包文件，改为使用命令本地生成。

## 本地生成压缩包

在仓库根目录执行：

```bash
zip -r range-picker-demo.zip . -x '.git/*' 'node_modules/*'
```

生成路径：

- `./range-picker-demo.zip`

## 一键打包脚本

如果你不熟悉 GitHub 下载代码，可以直接在项目根目录执行：

```bash
bash scripts/package.sh
```

执行后会在仓库根目录生成：

- `range-picker-demo.zip`
