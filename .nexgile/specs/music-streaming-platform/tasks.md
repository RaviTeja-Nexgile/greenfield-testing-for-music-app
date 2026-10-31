# Tasks: Music Streaming Platform

- [ ] 1. Project setup
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_
  - _Files: package.json, README.md, .gitignore, .env.example, docker-compose.yml, web/**, server/**, e2e/.gitkeep_
  - _Verify: npm install_
  - _Verify: npm test_
  - _Area: setup_
  - _Issue: #1_

- [ ] 2. Sign in and sign up screen
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_
  - _Depends: 1_
  - _Files: web/src/pages/SignIn.tsx, web/src/pages/SignIn.module.css, server/src/routes/auth.ts, server/src/auth/**, server/src/__tests__/auth.test.ts_
  - _Mockups: agent_generated/ui-preview/sign-in.html_
  - _Verify: npm test --workspace server -- auth_
  - _Area: ui_
  - _Issue: #2_

- [ ] 3. App shell, sidebar, top bar and player bar
  - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_
  - _Depends: 1_
  - _Files: web/src/App.tsx, web/src/components/AppShell.tsx, web/src/components/Sidebar.tsx, web/src/components/TopBar.tsx, web/src/components/PlayerBar.tsx, web/src/components/PlayerBar.module.css, web/src/store/player.ts_
  - _Verify: npm test --workspace web -- player_
  - _Area: ui_
  - _Issue: #3_

- [ ] 4. Home page and discovery
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - _Depends: 1, 3_
  - _Files: web/src/pages/Home.tsx, web/src/pages/Home.module.css, server/src/routes/recommendations.ts, server/src/jobs/recommendations.ts, server/src/__tests__/recommendations.test.ts_
  - _Mockups: agent_generated/ui-preview/home.html_
  - _Verify: npm test --workspace server -- recommendations_
  - _Area: ui_
  - _Issue: #4_

- [ ] 5. Search screen
  - _Requirements: 3.1, 3.2, 3.3_
  - _Depends: 1, 3_
  - _Files: web/src/pages/Search.tsx, web/src/pages/Search.module.css, server/src/routes/catalog.ts, server/src/__tests__/search.test.ts_
  - _Mockups: agent_generated/ui-preview/search.html_
  - _Verify: npm test --workspace server -- search_
  - _Area: ui_
  - _Issue: #5_

- [ ] 6. Now playing screen and playback
  - _Requirements: 4.1, 4.8_
  - _Depends: 1, 3_
  - _Files: web/src/pages/Player.tsx, web/src/pages/Player.module.css, web/src/store/player.ts, server/src/routes/playback.ts, server/src/__tests__/playback.test.ts_
  - _Mockups: agent_generated/ui-preview/player.html_
  - _Verify: npm test --workspace server -- playback_
  - _Area: ui_
  - _Issue: #6_

- [ ] 7. Playlists and library
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - _Depends: 1, 3_
  - _Files: web/src/pages/Library.tsx, web/src/pages/Playlist.tsx, web/src/pages/Library.module.css, server/src/routes/library.ts, server/src/__tests__/library.test.ts_
  - _Verify: npm test --workspace server -- library_
  - _Area: ui_
  - _Issue: #7_

- [ ] 8. Albums and artists
  - _Requirements: 6.1, 6.2, 6.3_
  - _Depends: 1, 3_
  - _Files: web/src/pages/Album.tsx, web/src/pages/Artist.tsx, web/src/pages/Album.module.css, server/src/routes/catalog.ts, server/src/__tests__/catalog.test.ts_
  - _Verify: npm test --workspace server -- catalog_
  - _Area: ui_
  - _Issue: #8_

- [ ] 9. Liked songs
  - _Requirements: 7.1, 7.2, 7.3_
  - _Depends: 1, 3_
  - _Files: web/src/pages/LikedSongs.tsx, web/src/pages/LikedSongs.module.css, server/src/routes/library.ts, server/src/__tests__/liked.test.ts_
  - _Verify: npm test --workspace server -- liked_
  - _Area: ui_
  - _Issue: #9_

- [ ] 10. Upload a song
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
  - _Depends: 1, 3_
  - _Files: web/src/pages/Upload.tsx, web/src/pages/Upload.module.css, server/src/routes/uploads.ts, server/src/storage/**, server/src/__tests__/uploads.test.ts_
  - _Verify: npm test --workspace server -- uploads_
  - _Area: ui_
  - _Issue: #10_

- [ ] 11. Manage uploaded songs
  - _Requirements: 9.1, 9.2, 9.3_
  - _Depends: 1, 3, 10_
  - _Files: web/src/pages/MySongs.tsx, web/src/pages/MySongs.module.css, server/src/routes/uploads.ts, server/src/__tests__/my-songs.test.ts_
  - _Verify: npm test --workspace server -- my-songs_
  - _Area: ui_
  - _Issue: #13_

- [ ] 12. Admin dashboard
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8_
  - _Depends: 1, 3, 10_
  - _Files: web/src/pages/Admin.tsx, web/src/pages/Admin.module.css, server/src/routes/admin.ts, server/src/__tests__/admin.test.ts_
  - _Mockups: agent_generated/ui-preview/admin-dashboard.html_
  - _Verify: npm test --workspace server -- admin_
  - _Area: ui_
  - _Issue: #14_

- [ ] 13. Subscription
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  - _Depends: 1, 3_
  - _Files: web/src/pages/Subscribe.tsx, web/src/pages/Subscribe.module.css, server/src/routes/subscription.ts, server/src/payments/**, server/src/__tests__/subscription.test.ts_
  - _Verify: npm test --workspace server -- subscription_
  - _Area: ui_
  - _Issue: #11_

- [ ] 14. User profile
  - _Requirements: 12.1, 12.2, 12.3_
  - _Depends: 1, 3_
  - _Files: web/src/pages/Profile.tsx, web/src/pages/Profile.module.css, server/src/routes/profile.ts, server/src/__tests__/profile.test.ts_
  - _Verify: npm test --workspace server -- profile_
  - _Area: ui_
  - _Issue: #12_

- [ ] 15. Deployment setup
  - _Requirements: 8.2, 11.5_
  - _Depends: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14_
  - _Files: Dockerfile, .dockerignore, docker-compose.prod.yml, infra/**, server/src/db/migrations/**_
  - _Verify: docker compose -f docker-compose.prod.yml config --quiet --no-interpolate_
  - _Verify: docker build -t music-streaming-platform:verify ._
  - _Mode: devops_
  - _Area: deploy_
  - _Issue: #15_
