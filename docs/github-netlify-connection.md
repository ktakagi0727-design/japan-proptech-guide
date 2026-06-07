# GitHubとNetlifyの接続・復旧手順

対象サイト: `japan-proptech-guide`

## 現在の構成

- GitHub: `https://github.com/k0727-design/japan-proptech-guide`
- 公開ブランチ: `main`
- Netlifyサイト: `japan-proptech-guide`
- 公開URL: `https://japan-proptech-guide.com`
- Build command: 空欄
- Publish directory: `.`

このサイトは静的サイトです。GitHubの`main`へ変更を反映すると、Netlifyがリポジトリを取得し、そのまま公開します。

## 今回接続が切れた理由

確認時、Netlify API上ではGitリポジトリ、公開ブランチ、Gitプロバイダーの設定が空欄でした。そのため、GitHubの`main`を更新してもNetlifyの自動デプロイが開始されませんでした。

GitHubのリポジトリは、以前の次の場所から移動しています。

- 旧: `ktakagi0727-design/japan-proptech-guide`
- 新: `k0727-design/japan-proptech-guide`

Netlifyの管理画面には旧リポジトリ名が残っていました。リポジトリまたはGitHubアカウントの移転・名称変更後に、Netlify側のGitHub App権限や内部のリポジトリ識別情報が追従しなかった可能性が高いです。

ただし、Netlifyの監査ログを確認していないため、移転が直接の原因だったとは断定できません。手動で接続解除された場合や、GitHub Appの権限が変更された場合にも同じ状態になります。

## 再接続手順

1. [Netlify](https://app.netlify.com/)を開く。
2. `japan-proptech-guide`プロジェクトを選択する。
3. `Project configuration`を開く。
4. `Build & deploy`を開く。
5. `Continuous deployment`の`Repository`を確認する。
6. 古いリポジトリが表示されている場合は、`Manage repository`から`Unlink repository`を選択する。
7. `Link to an existing repository`を選択する。
8. Git providerで`GitHub`を選択する。
9. GitHubアカウントまたは組織として`k0727-design`を選択する。
10. `japan-proptech-guide`を選択する。
11. 次の設定を入力する。

| 項目 | 設定値 |
| --- | --- |
| Production branch | `main` |
| Base directory | 空欄 |
| Build command | 空欄 |
| Publish directory | `.` |
| Functions directory | 空欄 |

12. `Configure project and deploy`または`Save`を押す。

既存の独自ドメインを維持するため、新しいNetlifyプロジェクトは作成せず、既存の`japan-proptech-guide`へ接続します。

## GitHubにリポジトリが表示されない場合

1. GitHubで`Settings`を開く。
2. `Applications`を開く。
3. `Installed GitHub Apps`から`Netlify`を開く。
4. `Configure`を押す。
5. Repository accessで次のいずれかを設定する。
   - `All repositories`
   - `Only select repositories`で`japan-proptech-guide`を追加
6. Netlifyへ戻り、リポジトリ選択画面を再読み込みする。

## 接続後の確認

1. Netlifyの`Deploys`を開く。
2. 最新デプロイのProduction branchが`main`であることを確認する。
3. 必要なら`Trigger deploy`から`Deploy site`を実行する。
4. デプロイが`Published`になったことを確認する。
5. 次のURLを開いて表示を確認する。
   - `https://japan-proptech-guide.com/`
   - `https://japan-proptech-guide.com/cases/`
   - `https://japan-proptech-guide.com/cases/tokyo-tatemono.html`

## 自動デプロイの動作確認

接続後は、`main`へ小さな変更を反映し、NetlifyのDeploysに新しいデプロイが自動作成されることを確認します。

デプロイが始まらない場合は、次を確認します。

- NetlifyのProduction branchが`main`になっている
- Deploysで自動公開が停止されていない
- GitHub Appが対象リポジトリへアクセスできる
- GitHubの最新コミットとNetlifyのDeploy commitが一致している

## リポジトリ移転時の注意

GitHubの所有者名やリポジトリ名を変更した場合は、次の2か所を更新します。

1. ローカルのGitリモート

```powershell
git remote set-url origin https://github.com/k0727-design/japan-proptech-guide.git
```

2. NetlifyのContinuous deployment

Netlifyで既存接続を解除し、新しいリポジトリへ再接続します。GitHubが旧URLから自動転送していても、Netlifyの自動デプロイ接続が維持されるとは限りません。

