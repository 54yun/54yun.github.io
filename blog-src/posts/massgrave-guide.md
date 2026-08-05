---
title: Microsoft Activation Scripts (MAS) 激活工具简介
date: 2026-08-05
---

# Microsoft Activation Scripts (MAS) 激活工具简介

[MAS](https://massgrave.dev/) 全称 Microsoft Activation Scripts,是一个开源的 Windows / Office 激活脚本项目,支持 HWID、Ohook、TSforge、Online KMS 等多种激活方式,还附带激活状态检测和排障功能。项目完全开源,基于批处理脚本编写,目前最新版本为 v3.12(2026-07-04)。

## 支持的激活方式

| 方式 | 适用产品 | 激活期限 | 是否需要联网 |
| ---- | ---- | ---- | ---- |
| HWID | Windows 10 / 11 | 永久(数字许可证) | 是 |
| Ohook | Office | 永久 | 否 |
| TSforge | Windows / ESU / Office | 永久 | 视情况(26100+ 构建需联网) |
| Online KMS | Windows / Office | 180 天(配合续期任务可长期) | 是 |

- **HWID**:把激活信息写入硬件,重装系统后联网自动激活,最接近正版体验
- **Ohook**:通过本地拦截 Office 的许可校验实现永久激活,不联网
- **TSforge**:较新的方式,支持 Windows、ESU 和 Office 的永久激活
- **Online KMS**:经典 KMS 方式,180 天周期,可添加计划任务自动续期

## 使用方法

### 方式一:PowerShell(推荐)

适用于 Windows 8.1 / 10 / 11。在开始菜单搜索 PowerShell 打开,粘贴执行:

```powershell
irm https://get.activated.win | iex
```

`irm` 从指定 URL 下载脚本,`iex` 执行它。运行后在菜单里输入绿色选项对应的数字即可。

如果命令被 ISP 或 DNS 封锁(Windows 10 / 11):

```powershell
iex (curl.exe -s --doh-url https://1.1.1.1/dns-query https://get.activated.win | Out-String)
```

老版本系统遇到 TLS 报错时,先执行:

```powershell
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12
```

### 方式二:传统方式(离线文件)

从官网下载 `MAS_AIO.cmd`(或 `MAS_AIO.zip`),右键以管理员身份运行,按菜单提示操作即可。

## 其他功能

- `$OEM$` 文件夹预激活
- 切换 Windows / Office 版本(版本互转)
- 查询当前系统激活状态
- 高级激活排障
- 提供 All-In-One 单文件和分文件两种版本

## 注意事项

- 官网明确提醒:**`irm | iex` 是从远程下载并执行脚本**,执行前务必确认 URL 来源可信
- 网上有第三方把命令中的 URL 篡改后伪装成 MAS 传播恶意软件,请只使用官方渠道
- 部分杀毒软件可能对激活脚本报毒,属于误报的常见情况
- 启用浏览器 DNS-over-HTTPS(DoH)可以绕过部分运营商对官网域名的封锁

## 免责声明

本文章仅作技术信息整理。请仅在拥有合法授权的前提下使用激活工具,比如用于自己已购买正版许可的重装场景。软件使用产生的后果由使用者自行承担。
