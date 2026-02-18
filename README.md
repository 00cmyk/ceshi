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

## 下载步骤图文版（最简）

> 目标文件：`/workspace/ceshi/range-picker-demo.zip`

### 方式 A：在当前页面文件树里下载（推荐）

1. 先在终端执行打包命令（如果你还没生成 zip）：

```bash
bash scripts/package.sh
```

2. 在左侧文件树中展开 `workspace -> ceshi`。
3. 找到文件 `range-picker-demo.zip`。
4. 右键该文件（或点文件后的 `...` 菜单）。
5. 点击 **Download / 下载**。

图示（示意）：

```text
workspace
└─ ceshi
   ├─ src
   ├─ scripts
   └─ range-picker-demo.zip   ← 右键这里下载
```

### 方式 B：如果你会命令行（可选）

在本机终端用 `scp` 下载（把 `YOUR_HOST`、`YOUR_USER` 换成你的实际信息）：

```bash
scp YOUR_USER@YOUR_HOST:/workspace/ceshi/range-picker-demo.zip ./
```

---

如果你告诉我你现在使用的平台（例如：Codespaces、Gitpod、云主机面板、VS Code Remote），我可以把上面步骤再改成**对应你界面的 3 步版**（带精确按钮名称）。
