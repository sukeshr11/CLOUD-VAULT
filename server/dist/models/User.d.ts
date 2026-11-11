import mongoose from 'mongoose';
export declare const User: mongoose.Model<{
    auth0Id: string;
    email?: string | null | undefined;
    name?: string | null | undefined;
    preferences: any;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    auth0Id: string;
    email?: string | null | undefined;
    name?: string | null | undefined;
    preferences: any;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    auth0Id: string;
    email?: string | null | undefined;
    name?: string | null | undefined;
    preferences: any;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    auth0Id: string;
    email?: string | null | undefined;
    name?: string | null | undefined;
    preferences: any;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    auth0Id: string;
    email?: string | null | undefined;
    name?: string | null | undefined;
    preferences: any;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    auth0Id: string;
    email?: string | null | undefined;
    name?: string | null | undefined;
    preferences: any;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    auth0Id: string;
    email?: string | null | undefined;
    name?: string | null | undefined;
    preferences: any;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    auth0Id: string;
    email?: string | null | undefined;
    name?: string | null | undefined;
    preferences: any;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & Required<{
    _id: mongoose.Types.ObjectId;
}>>;
//# sourceMappingURL=User.d.ts.map