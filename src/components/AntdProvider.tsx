'use client'

import { ConfigProvider, theme } from 'antd'

export default function AntdProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#00FF87',
          colorBgContainer: '#141B2D',
          colorBgElevated: '#1A2138',
          colorBorder: 'rgba(255, 255, 255, 0.1)',
          colorText: '#FFFFFF',
          colorTextSecondary: '#8B92B2',
          borderRadius: 8,
          fontSize: 16,
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}
