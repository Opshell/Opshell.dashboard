<script setup lang="ts">
    import piniaStore from '@/store';
    import { admin } from '@/apis';
    import { useGlobalProperties } from '@/hooks/utilityFunctions';

    import { useQuasar } from 'quasar';
    import notifyComponent from '@/components/mole/notify.vue';

    const proxy = useGlobalProperties();
    const userStore = piniaStore.useUserStore;

    const route = useRoute();
    const router = useRouter();
    const $q = useQuasar();

    const isPasswordVisible = ref(false);
    const isSubmitting = ref(false);

    // data
    const username = ref('');
    const password = ref('');
    const verification = ref('');

    onMounted(() => { // [#] 可以增加填入記憶的帳號
        username.value = 'admin';
        password.value = 'admin';
    });

    const loginHandler = async() => {
        isSubmitting.value = true;

        // [M] Login API
        const auth = await admin.login(
            username.value,
            password.value,
            verification.value
        );

        if (!auth) { // null
            proxy.$notify('error', '登入錯誤！', '網路錯誤，請聯繫管理員。');

            return;
        }

        if ('status' in auth && 'access_token' in auth) { // 有回傳狀態
            userStore.signIn(auth.access_token as string, auth.refresh_token);

            const redirect = route.redirectedFrom?.fullPath || '/';
            router.push({path: redirect});
        } else if ('errors' in auth) { // 檢查錯誤
            $q.dialog({
                component: notifyComponent,
                componentProps: {
                    title: '登入錯誤！',
                    message: auth.errors,
                },
            }).onCancel(() => {
                const firstEmptyInput = document.querySelector(`input[name=${auth.firstEmptyInput}]`);
                (firstEmptyInput as HTMLElement | null)?.focus();
            });
        } else { // 未知錯誤
            $q.dialog({
                component: notifyComponent,
                componentProps: {
                    title: '登入失敗！',
                    message: 'Token 缺失！',
                },
            });
        }
    };

    const forgetHandler = () => {
        // [#] 之後補彈跳寄信視窗
        $q.dialog({
            component: notifyComponent,
            componentProps: {
                type: 'warning',
                title: '提醒！',
                message: '請聯絡管理員！',
            },
        });
    };
</script>

<template>
    <article class="login-block" :class="{sending: isSubmitting}">
        <section class="logo-block">
            <div class="logo-box">
                <ElImg class="logo" src="/assets/images/system_logo.jpg" />
            </div>
            <h1 class="title">Opsehll 管理後台</h1>
        </section>

        <form class="input-block">
            <ElInputBox fieldName="帳號">
                <ElInput type="text" v-model="username" name="username" placeholder="請輸入帳號" />
            </ElInputBox>

            <ElInputBox fieldName="密碼">
                <ElInput
                    :type="isPasswordVisible ? 'text': 'password'"
                    v-model="password"
                    name="password"
                    placeholder="請輸入密碼"
                >
                    <template v-slot:icon>
                        <ElSvgIcon
                            :name="isPasswordVisible ? 'visibility_off' : 'visibility'"
                            @click="isPasswordVisible = !isPasswordVisible"
                        />
                    </template>
                </ElInput>
            </ElInputBox>

            <ElInputBox fieldName="驗證" class="disabled">
                <ElInput v-model="verification" placeholder="verification" :disable="true" />
            </ElInputBox>

            <div class="btn-box">
                <ElBtn class="sub" @click="forgetHandler">忘記密碼</ElBtn>
                <ElBtn class="hight" @click="loginHandler">登　入</ElBtn>
            </div>
        </form>

        <footer class="version">
            Version: 0.3.1
        </footer>
    </article>
</template>

<style lang="scss">
    .login-block {
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
        .logo-block {
            @include setFlex(flex-start, center, 16px, column);
            .logo-box {
                background: #eee;
                @include setSize(100px, 100px);
                border: 5px solid #f3f3f3;
                border-radius: 50%;
                box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.15),
                            0 0 2px 0 rgba(0, 0, 0, 0.15) inset;
                overflow: hidden;
            }
            .logo { width: 100%; }
            .title {
                color: var(--color-primary);
                font-size: 22px;
            }
        }

        .input-block {
            @include setFlex(flex-start, stretch, 15px, column);
            .inputBox {
                position: relative;
                width: 100%;
                padding: 0;
            }
        }

        .btn-box {
            @include setFlex(center, center, 15px);
            width: 100%;
            margin: 10px 0 0;
            .el-btn {
                &.sub { flex: 4; }
                &.hight { flex: 6; }
            }
        }

        .version {
            position: absolute;
            right: 9px;
            bottom: 6px;
            @include setFlex(flex-end);
            width: 100%;
            font-size: 12px;
        }

        &.sending {

        }
    }


</style>