<script setup lang="ts">
    import piniaStore from '@/store';
    import { getData } from '@/hooks/useApi';
    import { useValidactor } from '@/hooks/opshellLibary';
    import useGlobalProperties from '@/hooks/useGlobalProperties';
    const proxy = useGlobalProperties();

    const userStore = piniaStore.useUserStore;

    const route = useRoute();
    const router = useRouter();

    // data
    const loginForm = reactive({
        grant_type: 'password',
        client_id: '2',
        client_secret: 'xPi3Jrzm3IOW4wBaQQhip86SySsBLobaNmnUHTd4',
        scope: '',
        username: '',
        password: '',
        verification: '',
    });

    const showPass = ref(false);
    const showPassHandler = () => {
        showPass.value = !showPass.value;
    };

    onMounted(() => { // [#] 可以增加填入記憶的帳號
        loginForm.username = 'Opshell';
        loginForm.password = 'pass';
    });

    const handleLogin = () => {
        // 資料檢查
        const checker = new useValidactor();

        checker.checkEmpty(loginForm.username, '帳號', 'username');
        checker.checkEmpty(loginForm.password, '密碼', 'password');

        const errorMsg = checker.getErrorsAsString();

        if  (errorMsg === '') { // 檢查通過
            getData('/api/backEnd/login', 'POST', loginForm).then((auth) => { // 本機測試環境
                if(auth){
                    if (auth.status) {
                        // expires_in
                        // refresh_token
                        // token_type
                        if (auth.access_token) {
                            userStore.signIn(auth.access_token, auth.refresh_token);

                            // 導向來源 或者 首頁
                            const redirect = route.redirectedFrom?.fullPath || '/';
                            router.push({path: redirect});
                        } else {
                            proxy.$notify('error', '登入失敗！', 'Token 缺失！！');
                        }
                    } else {
                        proxy.$notify('error', '登入失敗！', auth.msg);
                    }
                } else {
                    proxy.$notify('error', '登入異常！', '網路錯誤！！');
                }
            });
        } else { // 檢查失敗
            proxy.$notify('error', '登入錯誤！', errorMsg).then(() => {
                const firstEmptyInput = document.querySelector(`input[name=${checker.getFirstEmptyInput()}]`);

                (firstEmptyInput as HTMLElement | null)?.focus();
            });
        }
    };

    const handleForget = () => {
        // [#] 之後補彈跳寄信視窗
        proxy.$notify('warning', '提醒！', '請聯絡管理員！！');
    };
</script>

<template>
    <article class="loginBlock">
        <section class="logoBlock">
            <div class="logoBox">
                <ElImg class="logo" src="/assets/images/Opshell-5x.png" />
            </div>
            <h1 class="title">Opsehll 管理後台</h1>
        </section>

        <form class="inputBlock">
            <ElInputBox fieldName="帳號">
                <ElInput type="text" v-model="loginForm.username" name="username" placeholder="請輸入帳號" />
            </ElInputBox>

            <ElInputBox fieldName="密碼">
                <ElInput :type="showPass ? 'text': 'password'" v-model="loginForm.password" name="password" placeholder="請輸入密碼" />
                <ElSvgIcon class="icon" :name="showPass ? 'eye-crossed': 'eye'" @click="showPassHandler"/>
            </ElInputBox>

            <ElInputBox fieldName="驗證" class="disabled">
                <ElInput v-model="loginForm.verification" placeholder="verification" :disabled="true" />
            </ElInputBox>

            <div class="btnBox">
                <ElBtn class="current" @click="handleLogin">登　入</ElBtn>
                <ElBtn class="back" @click="handleForget">忘記密碼</ElBtn>
            </div>
        </form>

        <footer class="version">
            Version: 0.3.1
        </footer>
    </article>
</template>

<style lang="scss" scoped>
    .loginBlock {
        @include setFlex(flex-start, stretch, 25px, column);

        background: rgba(220, 220, 220, 0.15);
        backdrop-filter: blur(8px);
        width: 100%;
        max-width: 380px;
        padding: 40px 40px 50px;
        border-radius: 15px;
        margin: 0 auto;
        backdrop-filter: blur(5px);

        @include setBorder();
        .logoBlock {
            @include setFlex(flex-start, center, 16px, column);
            .logoBox {
                background: #eee;
                @include setSize(100px, 100px);
                padding: 10px;
                border: 5px solid #f3f3f3;
                border-radius: 50%;
                box-sizing: border-box;

                box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.15),
                            0 0 2px 0 rgba(0, 0, 0, 0.15) inset;

                overflow: hidden;
            }
            .logo {
                width: 100%;
            }
            .title {
                color: $colorSubs;
                font-size: 22px;
            }
        }

        .inputBlock {
            @include setFlex(flex-start, center, 15px, column);
            .inputBox {
                position: relative;

                .icon {
                    position: absolute;
                    right: 5px;
                    top: 5px;
                    fill: $colorSubs;

                    @include setSize(auto, calc(100% - 10px));
                    aspect-ratio: 1 / 1;
                    padding: 5px;

                    border-radius: 5px;
                    cursor: pointer;
                }
            }
        }

        .btnBox {
            @include setFlex(center, center, 15px);
            width: 100%;
            margin: 10px 0 0;
        }

        .version {
            position: absolute;
            right: 9px;
            bottom: 6px;
            @include setFlex(flex-end);
            width: 100%;
            font-size: 12px;
        }
    }


</style>