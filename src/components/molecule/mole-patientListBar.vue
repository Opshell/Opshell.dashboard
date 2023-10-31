<script setup lang="ts">
    export interface iPatientItem {
        id: number,
        name: string;
        appStatus: boolean;
        identification: string; // uid
        age: number | string;
        note: string; // place
        appointment: string; // next
        doctor: string;
        disease: string; // history
        unread: string; // msg
    }

    const props = defineProps<{
        // header: iPatientItem;
        patient: iPatientItem;
        // editPatient: (id: number) => void;
    }>();

    const emit = defineEmits<{
        'editPatient': [id: number]
    }>();

    const href= ref(`/patient/${props.patient.id}`);
    const msgHref= ref(`/patient/${props.patient.id}/message-board`);
</script>

<template>
    <div class="patientListBar">
        <div class="td name">
            {{ patient.name }}
            <ElSvgIcon v-if="patient.appStatus" name="phone_iphone" />
            <ElSvgIcon v-else name="" />
        </div>
        <div class="td id">{{ patient.identification }}</div>
        <div class="td age">{{ patient.age }}<span v-if="patient.id != 0">歲</span></div>
        <div class="td place">洗腎部位</div>
        <div class="td next">{{ patient.appointment }}</div>
        <div class="td doctor">{{ patient.doctor }}</div>
        <div class="td history">{{ patient.disease }}</div>
        <div class="td msg">
            <template v-if="patient.id == 0">
                {{ patient.unread }}
            </template>
            <ElBtn v-if="patient.unread != '0' && patient.id != 0" :href="msgHref">{{ patient.unread }}</ElBtn>
        </div>
        <div class="td btn">
            <ElSvgIcon name="edit" @click="() => emit('editPatient', patient.id)"></ElSvgIcon>
            <ElBtn v-if="patient.id != 0" :href="href">查 看</ElBtn>
        </div>
    </div>
</template>

<style lang="scss">
    .patientListBar {
        display: grid;
        grid-template-areas: " name  id    age  place next  doctor history msg   btn";
        grid-template-columns: 130px 145px 80px 150px 150px 100px  1fr     80px 1fr;

        background: $colorBack;
        @include setSize(100%, 80px);
        border-radius: 20px;

        &.thead {
            background: $colorMain;
            height: 55px;
            .td {
                color: $colorUnFont;
                &.name .icon{background: transparent;}
            }
            @include setRWD(600px) {
                display: none;
            };
        }

        .td {
            @include setFlex(center, center, 8px);
            @include setSize(100%, 100%);
            padding: 15px 10px;
            color: #444;
            word-break: keep-all;
            &.name {
                grid-area: name;
                .icon {
                    @include setSize(32px, 32px);
                    fill: $colorMain;
                    padding: 6px;
                    background: #ddd;
                    border-radius: 50%;
                }
            }
            &.id { grid-area: id; }
            &.age { grid-area: age; }
            &.place { grid-area: place; }
            &.next { grid-area: next; }
            &.doctor { grid-area: doctor; }
            &.history { grid-area: history; }
            &.msg {
                grid-area: msg;
                .Btn{
                    background: #e88282;
                    @include setSize(36px, 36px);
                    border-radius: 50%;
                    color: $colorUnFont;
                    border: none;
                    padding: 5px;
                }
            }
            &.btn {
                grid-area: btn;
                justify-content: flex-end;
                gap: 15px;
                .icon {
                    fill: $colorMain;
                    @include setSize(35px, 35px);
                    cursor: pointer;
                    &:hover{
                        transform: scale3d(1.1, 1.1, 1);
                    }
                }
                .Btn {
                    background: $colorMain;
                    padding: 20px;
                    color: $colorUnFont;
                }
            }
        }

        @include setRWD(1280px){
            grid-template-areas: " name  id     age   history btn"
                                 " place doctor next  msg     btn";
            grid-template-columns: repeat(4, 1fr)   130px;

            padding-left: 25px;
            @include setSize(100%, 120px);

            &.thead {
                height: 120px;
            }

            .td {
                justify-content: flex-start;
                padding: 8px 10px;
                height: 100%;

                &.name, &.id, &.age, &.history {
                    border-bottom: 1px solid #ccc;
                }

                &.btn {
                    justify-content: center;
                    align-items: center;
                }

            }
        }

        @include setRWD(767px) {
            grid-template-areas: "name age age     btn"
                                 "id   history history history"
                                 "place doctor msg next";
            grid-template-columns: 1fr 85px 1fr 1fr;

            padding: 0 20px;
            // @include setSize(100%, 120px);
            height: 250px;
            .td {
                &.btn {
                    border-bottom: 1px solid #ccc;
                }
            }
        }

        @include setRWD(600px) {
            grid-template-areas: "name  btn"
                                 "id id"
                                 "age age"
                                 "place place"
                                 "history history"
                                 "doctor msg"
                                 "next next";
            grid-template-columns: 1fr 85px 1fr 1fr;

        }
    }
</style>


